$ErrorActionPreference = 'Continue'
$base = 'http://127.0.0.1:8788'

function New-Idem { [guid]::NewGuid().ToString() }

function Post-Rec([hashtable]$body, [string]$idem) {
  $json = $body | ConvertTo-Json -Depth 6 -Compress
  try {
    $resp = Invoke-WebRequest -Uri "$base/api/reclamaciones" -Method POST -Headers @{
      'Content-Type' = 'application/json'
      'Idempotency-Key' = $idem
    } -Body $json -UseBasicParsing
    return @{ status = [int]$resp.StatusCode; body = ($resp.Content | ConvertFrom-Json) }
  } catch {
    $r = $_.Exception.Response
    if ($r) {
      $stream = $r.GetResponseStream()
      $reader = New-Object System.IO.StreamReader($stream)
      $text = $reader.ReadToEnd()
      $parsed = $null
      try { $parsed = $text | ConvertFrom-Json } catch { $parsed = $text }
      return @{ status = [int]$r.StatusCode; body = $parsed }
    }
    return @{ status = 0; body = $_.Exception.Message }
  }
}

function New-Adult([string]$nombre, [string]$correo, [string]$detalle) {
  return @{
    esMenor = $false
    nombreApoderado = ''
    domicilioApoderado = ''
    telefonoApoderado = ''
    correoApoderado = ''
    nombre = $nombre
    documento = '12345678'
    telefono = '999111222'
    domicilio = 'Av. Prueba 1 Lima'
    correo = $correo
    tipoBien = 'Servicio'
    montoReclamado = '100'
    descripcionBien = 'Acabados'
    tipoReclamo = 'Reclamo'
    detalle = $detalle
    pedido = "Pedido $nombre"
    turnstileToken = 'test-token'
  }
}

Write-Host '=== 1-3 correlativo ==='
$r1 = Post-Rec (New-Adult 'Consumidor Uno' 'prueba1@example.com' 'Detalle 1') (New-Idem)
$r2 = Post-Rec (New-Adult 'Consumidor Dos' 'prueba2@example.com' 'Detalle 2') (New-Idem)
$r3 = Post-Rec (New-Adult 'Consumidor Tres' 'prueba3@example.com' 'Detalle 3') (New-Idem)
Write-Host ("R1 {0} codigo={1}" -f $r1.status, $r1.body.data.codigo)
Write-Host ("R2 {0} codigo={1}" -f $r2.status, $r2.body.data.codigo)
Write-Host ("R3 {0} codigo={1}" -f $r3.status, $r3.body.data.codigo)

Write-Host '=== idempotency reuse ==='
$idem = New-Idem
$payloadIdem = New-Adult 'Idem User' 'idem@example.com' 'Idem detalle'
$i1 = Post-Rec $payloadIdem $idem
$i2 = Post-Rec $payloadIdem $idem
Write-Host ("I1 {0} codigo={1} reused={2}" -f $i1.status, $i1.body.data.codigo, $i1.body.data.reused)
Write-Host ("I2 {0} codigo={1} reused={2}" -f $i2.status, $i2.body.data.codigo, $i2.body.data.reused)

Write-Host '=== content conflict ==='
$conflict = New-Adult 'Idem User' 'idem@example.com' 'Contenido distinto'
$i3 = Post-Rec $conflict $idem
Write-Host ("I3 status={0} code={1}" -f $i3.status, $i3.body.error.code)

Write-Host '=== menor completo ==='
$menor = @{
  esMenor = $true
  nombreApoderado = 'Apoderado Completo'
  domicilioApoderado = 'Calle Apoderado 10'
  telefonoApoderado = '988777666'
  correoApoderado = 'apoderado@example.com'
  nombre = 'Menor Prueba'
  documento = '70001122'
  telefono = '911000111'
  domicilio = 'Calle Menor 5'
  correo = 'menor@example.com'
  tipoBien = 'Servicio'
  montoReclamado = '50.5'
  descripcionBien = 'Servicio menor'
  tipoReclamo = 'Reclamo'
  detalle = 'Detalle menor'
  pedido = 'Pedido menor'
  turnstileToken = 'test-token'
}
$m1 = Post-Rec $menor (New-Idem)
Write-Host ("M1 {0} codigo={1}" -f $m1.status, $m1.body.data.codigo)

Write-Host '=== menor incompleto ==='
$menorBad = @{
  esMenor = $true
  nombreApoderado = ''
  domicilioApoderado = ''
  telefonoApoderado = ''
  correoApoderado = 'no-email'
  nombre = 'Menor Bad'
  documento = '70001123'
  telefono = '911000112'
  domicilio = 'Calle Menor 6'
  correo = 'menor2@example.com'
  tipoBien = 'Servicio'
  montoReclamado = ''
  descripcionBien = 'Servicio'
  tipoReclamo = 'Queja'
  detalle = 'Detalle'
  pedido = 'Pedido'
  turnstileToken = 'test-token'
}
$m2 = Post-Rec $menorBad (New-Idem)
Write-Host ("M2 status={0}" -f $m2.status)
if ($m2.body.error.details) {
  Write-Host ($m2.body.error.details | ConvertTo-Json -Compress)
}

Write-Host '=== contacto ==='
$cBody = @{
  nombre = 'Contacto Local'
  empresa = 'Empresa SA'
  correo = 'contacto@example.com'
  telefono = '900111222'
  partida = 'Acabados'
  ubicacion = 'Rimac'
  descripcion = 'Consulta de prueba local'
  aceptaPrivacidad = $true
  turnstileToken = 'test-token'
} | ConvertTo-Json -Compress
try {
  $c = Invoke-WebRequest -Uri "$base/api/contacto" -Method POST -Headers @{
    'Content-Type' = 'application/json'
    'Idempotency-Key' = (New-Idem)
  } -Body $cBody -UseBasicParsing
  Write-Host ("Contacto {0}" -f $c.StatusCode)
} catch {
  $r = $_.Exception.Response
  if ($r) { Write-Host ("Contacto status={0}" -f [int]$r.StatusCode) }
  else { Write-Host ("Contacto ERR {0}" -f $_.Exception.Message) }
}

Write-Host '=== concurrent ==='
$jobs = 1..5 | ForEach-Object {
  $n = $_
  Start-Job -ScriptBlock {
    param($baseUrl, $n)
    $idem = [guid]::NewGuid().ToString()
    $body = @{
      esMenor = $false
      nombreApoderado = ''
      domicilioApoderado = ''
      telefonoApoderado = ''
      correoApoderado = ''
      nombre = "Concurrent $n"
      documento = "1000000$n"
      telefono = '999000000'
      domicilio = 'Dir Concurrente'
      correo = "c$n@example.com"
      tipoBien = 'Servicio'
      montoReclamado = ''
      descripcionBien = 'Conc'
      tipoReclamo = 'Reclamo'
      detalle = "Detalle concurrente $n"
      pedido = "Pedido $n"
      turnstileToken = 'test-token'
    } | ConvertTo-Json -Compress
    try {
      $resp = Invoke-WebRequest -Uri "$baseUrl/api/reclamaciones" -Method POST -Headers @{
        'Content-Type' = 'application/json'
        'Idempotency-Key' = $idem
      } -Body $body -UseBasicParsing
      return ($resp.Content | ConvertFrom-Json).data.codigo
    } catch {
      return "ERR"
    }
  } -ArgumentList $base, $n
}
$codes = $jobs | Wait-Job | Receive-Job
$jobs | Remove-Job
Write-Host ("Concurrent codes: {0}" -f ($codes -join ', '))
$okCodes = @($codes | Where-Object { $_ -like 'EF-*' })
Write-Host ("Unique OK={0} Total OK={1}" -f (($okCodes | Sort-Object -Unique).Count), $okCodes.Count)

Write-Host 'DONE'
