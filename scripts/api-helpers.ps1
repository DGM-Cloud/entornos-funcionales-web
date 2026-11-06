$script:ApiBase = 'http://127.0.0.1:8791'

function New-Idem { [guid]::NewGuid().ToString() }

function New-Payload {
  param(
    [string]$Nombre = 'Consumidor Test',
    [string]$Correo = 'test@example.com',
    [string]$Detalle = 'Detalle test',
    [bool]$EsMenor = $false
  )
  $p = @{
    esMenor = $EsMenor
    nombreApoderado = ''
    domicilioApoderado = ''
    telefonoApoderado = ''
    correoApoderado = ''
    nombre = $Nombre
    documento = '12345678'
    telefono = '999111222'
    domicilio = 'Av. Prueba 1'
    correo = $Correo
    tipoBien = 'Servicio'
    montoReclamado = '10'
    descripcionBien = 'Servicio test'
    tipoReclamo = 'Reclamo'
    detalle = $Detalle
    pedido = 'Pedido test'
    turnstileToken = 'test-token'
  }
  if ($EsMenor) {
    $p.nombreApoderado = 'Apoderado Completo'
    $p.domicilioApoderado = 'Calle Apoderado 10'
    $p.telefonoApoderado = '988777666'
    $p.correoApoderado = 'apoderado@example.com'
    $p.nombre = 'Menor Test'
  }
  return $p
}

function Post-Rec([hashtable]$body, [string]$idem) {
  $json = $body | ConvertTo-Json -Depth 6 -Compress
  try {
    $resp = Invoke-WebRequest -Uri "$script:ApiBase/api/reclamaciones" -Method POST -Headers @{
      'Content-Type' = 'application/json'
      'Idempotency-Key' = $idem
    } -Body $json -UseBasicParsing
    return @{ status = [int]$resp.StatusCode; raw = $resp.Content; body = ($resp.Content | ConvertFrom-Json) }
  } catch {
    $r = $_.Exception.Response
    if (-not $r) { throw }
    $text = (New-Object System.IO.StreamReader($r.GetResponseStream())).ReadToEnd()
    $parsed = $null
    try { $parsed = $text | ConvertFrom-Json } catch { $parsed = $text }
    return @{ status = [int]$r.StatusCode; raw = $text; body = $parsed }
  }
}

function Get-D1Json([string]$sql) {
  $out = npx wrangler d1 execute entornos-funcionales-reclamos --local --command $sql --json 2>$null
  return ($out | ConvertFrom-Json)
}

function Get-Seq {
  $j = Get-D1Json "SELECT ultimo FROM reclamacion_secuencia WHERE id=1;"
  return [int]$j[0].results[0].ultimo
}

function Get-Row([string]$codigo) {
  $j = Get-D1Json "SELECT codigo, es_menor, nombre_apoderado, domicilio_apoderado, telefono_apoderado, correo_apoderado, mail_status, mail_empresa_status, mail_constancia_status, mail_last_error FROM reclamaciones WHERE codigo='$codigo' LIMIT 1;"
  return $j[0].results[0]
}
