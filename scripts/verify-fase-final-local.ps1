# Verificación local: correlativo atómico, correos mock, sin envíos reales.
# Uso: powershell -ExecutionPolicy Bypass -File .\scripts\verify-fase-final-local.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$base = 'http://127.0.0.1:8791'
$port = 8791
$devVarsPath = Join-Path $root '.dev.vars'
$report = @()

function Write-Step($msg) { Write-Host ""; Write-Host "=== $msg ===" -ForegroundColor Cyan }

function Set-MockMode([string]$mode) {
  @(
    "RESEND_MOCK_MODE=$mode"
    ""
    "# Generado por scripts/verify-fase-final-local.ps1 — sin API keys reales."
  ) | Set-Content -Path $devVarsPath -Encoding utf8
}

function Reset-LocalDb {
  npx wrangler d1 execute entornos-funcionales-reclamos --local --command "DELETE FROM reclamaciones; UPDATE reclamacion_secuencia SET ultimo = 0 WHERE id = 1;" | Out-Null
}

function Get-Seq {
  $raw = npx wrangler d1 execute entornos-funcionales-reclamos --local --command "SELECT ultimo FROM reclamacion_secuencia WHERE id=1;" --json 2>$null
  $parsed = $raw | ConvertFrom-Json
  return [int]$parsed[0].results[0].ultimo
}

function Get-Row([string]$codigo) {
  $sql = "SELECT codigo, es_menor, nombre_apoderado, domicilio_apoderado, telefono_apoderado, correo_apoderado, mail_status, mail_empresa_status, mail_constancia_status FROM reclamaciones WHERE codigo='$codigo' LIMIT 1;"
  $raw = npx wrangler d1 execute entornos-funcionales-reclamos --local --command $sql --json 2>$null
  $parsed = $raw | ConvertFrom-Json
  return $parsed[0].results[0]
}

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
    $resp = Invoke-WebRequest -Uri "$base/api/reclamaciones" -Method POST -Headers @{
      'Content-Type' = 'application/json'
      'Idempotency-Key' = $idem
    } -Body $json -UseBasicParsing
    return @{ status = [int]$resp.StatusCode; body = ($resp.Content | ConvertFrom-Json) }
  } catch {
    $r = $_.Exception.Response
    if (-not $r) { throw }
    $text = (New-Object System.IO.StreamReader($r.GetResponseStream())).ReadToEnd()
    $parsed = $null
    try { $parsed = $text | ConvertFrom-Json } catch { $parsed = $text }
    return @{ status = [int]$r.StatusCode; body = $parsed }
  }
}

function Start-DevServer {
  param([string]$Mode)
  Set-MockMode $Mode
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
  }
  Start-Sleep -Seconds 1
  $script:devProc = Start-Process -FilePath "npx" -ArgumentList @(
    "wrangler","pages","dev","dist/entornos-funcionales/browser",
    "--ip","127.0.0.1","--port","$port",
    "--d1=DB=e18abc8e-44ec-4798-98b6-5719643aba63"
  ) -WorkingDirectory $root -PassThru -WindowStyle Hidden -RedirectStandardOutput (Join-Path $root "scripts/.wrangler-verify-out.log") -RedirectStandardError (Join-Path $root "scripts/.wrangler-verify-err.log")
  $ready = $false
  for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 1
    try {
      Invoke-WebRequest -Uri "$base/" -UseBasicParsing -TimeoutSec 2 | Out-Null
      $ready = $true
      break
    } catch { }
  }
  if (-not $ready) { throw "Servidor local no arrancó en :$port (mock=$Mode)" }
}

function Stop-DevServer {
  if ($script:devProc -and -not $script:devProc.HasExited) {
    Stop-Process -Id $script:devProc.Id -Force -ErrorAction SilentlyContinue
  }
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
  }
  Start-Sleep -Seconds 1
}

try {
  Write-Step "Build"
  npm run build | Out-Host

  Write-Step "Reset D1 local"
  Reset-LocalDb

  # ---------- Correos: success ----------
  Write-Step "Mock success — ambos correos"
  Start-DevServer 'success'
  $rOk = Post-Rec (New-Payload -Nombre 'Ok User' -Correo 'ok@example.com' -EsMenor $true -Detalle 'Caso success') (New-Idem)
  $codeOk = $rOk.body.data.codigo
  $rowOk = Get-Row $codeOk
  $report += "success: status=$($rOk.status) codigo=$codeOk empresa=$($rowOk.mail_empresa_status) constancia=$($rowOk.mail_constancia_status) overall=$($rowOk.mail_status) apoderado=$($rowOk.nombre_apoderado)"
  if ($rOk.status -ne 200 -or $rowOk.mail_empresa_status -ne 'sent' -or $rowOk.mail_constancia_status -ne 'sent') {
    throw "Fallo escenario success: $($report[-1])"
  }
  if ($rowOk.domicilio_apoderado -ne 'Calle Apoderado 10') { throw "Apoderado no persistió" }

  # ---------- fail_empresa ----------
  Write-Step "Mock fail_empresa"
  Stop-DevServer
  Start-DevServer 'fail_empresa'
  $rFe = Post-Rec (New-Payload -Nombre 'Fail Empresa' -Correo 'fe@example.com' -Detalle 'Caso fail_empresa') (New-Idem)
  $rowFe = Get-Row $rFe.body.data.codigo
  $report += "fail_empresa: codigo=$($rFe.body.data.codigo) empresa=$($rowFe.mail_empresa_status) constancia=$($rowFe.mail_constancia_status) overall=$($rowFe.mail_status)"
  if ($rowFe.mail_empresa_status -ne 'failed' -or $rowFe.mail_constancia_status -ne 'sent') {
    throw "Fallo escenario fail_empresa: $($report[-1])"
  }

  # ---------- fail_constancia ----------
  Write-Step "Mock fail_constancia"
  Stop-DevServer
  Start-DevServer 'fail_constancia'
  $rFc = Post-Rec (New-Payload -Nombre 'Fail Constancia' -Correo 'fc@example.com' -Detalle 'Caso fail_constancia') (New-Idem)
  $rowFc = Get-Row $rFc.body.data.codigo
  $report += "fail_constancia: codigo=$($rFc.body.data.codigo) empresa=$($rowFc.mail_empresa_status) constancia=$($rowFc.mail_constancia_status) overall=$($rowFc.mail_status)"
  if ($rowFc.mail_empresa_status -ne 'sent' -or $rowFc.mail_constancia_status -ne 'failed') {
    throw "Fallo escenario fail_constancia: $($report[-1])"
  }

  # ---------- fail_both ----------
  Write-Step "Mock fail_both"
  Stop-DevServer
  Start-DevServer 'fail_both'
  $rFb = Post-Rec (New-Payload -Nombre 'Fail Both' -Correo 'fb@example.com' -Detalle 'Caso fail_both') (New-Idem)
  $codeFb = $rFb.body.data.codigo
  $rowFb = Get-Row $codeFb
  $report += "fail_both: codigo=$codeFb empresa=$($rowFb.mail_empresa_status) constancia=$($rowFb.mail_constancia_status) overall=$($rowFb.mail_status)"
  if ($rowFb.mail_empresa_status -ne 'failed' -or $rowFb.mail_constancia_status -ne 'failed') {
    throw "Fallo escenario fail_both: $($report[-1])"
  }

  # ---------- reintento sin duplicar (idempotency + misma clave) ----------
  Write-Step "Reintento idempotente (fail_both -> success) sin nuevo código"
  Stop-DevServer
  $idemRetry = New-Idem
  $payloadRetry = New-Payload -Nombre 'Retry User' -Correo 'retry@example.com' -Detalle 'Caso retry'
  # Primera con fail_both (servidor ya en fail_both)
  Start-DevServer 'fail_both'
  $r1 = Post-Rec $payloadRetry $idemRetry
  $code1 = $r1.body.data.codigo
  Stop-DevServer
  Start-DevServer 'success'
  $r2 = Post-Rec $payloadRetry $idemRetry
  $code2 = $r2.body.data.codigo
  $rowRetry = Get-Row $code2
  $report += "retry: first=$code1 second=$code2 reused=$($r2.body.data.reused) empresa=$($rowRetry.mail_empresa_status) constancia=$($rowRetry.mail_constancia_status)"
  if ($code1 -ne $code2) { throw "Reintento generó código distinto" }
  if ($r2.body.data.reused -ne $true) { throw "Reintento no marcó reused" }
  if ($rowRetry.mail_empresa_status -ne 'sent' -or $rowRetry.mail_constancia_status -ne 'sent') {
    throw "Reintento no completó correos: $($report[-1])"
  }

  # ---------- correlativo / concurrencia / rollback idempotencia ----------
  Write-Step "Concurrencia e idempotencia (rollback de secuencia)"
  Stop-DevServer
  Start-DevServer 'success'
  $seqBefore = Get-Seq

  $jobs = 1..6 | ForEach-Object {
    $n = $_
    Start-Job -ScriptBlock {
      param($baseUrl, $n)
      $idem = [guid]::NewGuid().ToString()
      $body = @{
        esMenor = $false; nombreApoderado = ''; domicilioApoderado = ''; telefonoApoderado = ''; correoApoderado = ''
        nombre = "Concurrent $n"; documento = "200000$n"; telefono = '999000000'; domicilio = 'Dir'
        correo = "c$n@example.com"; tipoBien = 'Servicio'; montoReclamado = ''; descripcionBien = 'Conc'
        tipoReclamo = 'Reclamo'; detalle = "Detalle $n"; pedido = "Pedido $n"; turnstileToken = 'test-token'
      } | ConvertTo-Json -Compress
      try {
        $resp = Invoke-WebRequest -Uri "$baseUrl/api/reclamaciones" -Method POST -Headers @{
          'Content-Type' = 'application/json'; 'Idempotency-Key' = $idem
        } -Body $body -UseBasicParsing
        return ($resp.Content | ConvertFrom-Json).data.codigo
      } catch { return 'ERR' }
    } -ArgumentList $base, $n
  }
  $codes = $jobs | Wait-Job | Receive-Job
  $jobs | Remove-Job
  $ok = @($codes | Where-Object { $_ -match '^EF-\d{6}$' })
  $unique = @($ok | Sort-Object -Unique)
  $report += "concurrent: codes=$($ok -join ',') unique=$($unique.Count)/$($ok.Count)"
  if ($unique.Count -ne $ok.Count -or $ok.Count -lt 6) { throw "Concurrencia duplicó o falló: $($report[-1])" }

  # Misma clave concurrente: solo una fila; secuencia no debe saltar de más por el perdedor
  $seqMid = Get-Seq
  $sharedIdem = New-Idem
  $sharedPayload = New-Payload -Nombre 'Shared Idem' -Correo 'shared@example.com' -Detalle 'shared-idem'
  $raceJobs = 1..4 | ForEach-Object {
    Start-Job -ScriptBlock {
      param($baseUrl, $idem, $json)
      try {
        $resp = Invoke-WebRequest -Uri "$baseUrl/api/reclamaciones" -Method POST -Headers @{
          'Content-Type' = 'application/json'; 'Idempotency-Key' = $idem
        } -Body $json -UseBasicParsing
        return ($resp.Content | ConvertFrom-Json).data.codigo
      } catch {
        return 'CONFLICT_OR_ERR'
      }
    } -ArgumentList $base, $sharedIdem, ($sharedPayload | ConvertTo-Json -Depth 6 -Compress)
  }
  $raceCodes = $raceJobs | Wait-Job | Receive-Job
  $raceJobs | Remove-Job
  $raceOk = @($raceCodes | Where-Object { $_ -match '^EF-\d{6}$' }) | Sort-Object -Unique
  $seqAfterRace = Get-Seq
  $report += "idem-race: codes=$($raceCodes -join ',') uniqueOk=$($raceOk -join ',') seqDelta=$($seqAfterRace - $seqMid)"
  if ($raceOk.Count -ne 1) { throw "Carrera de idempotencia produjo $($raceOk.Count) códigos" }
  # El batch fallido debe revertir el incremento: delta de secuencia = 1 (solo el ganador)
  if (($seqAfterRace - $seqMid) -ne 1) {
    throw "Secuencia quemó números en carrera idempotente: delta=$($seqAfterRace - $seqMid) (esperado 1)"
  }

  $seqFinal = Get-Seq
  $report += "seq: before_conc=$seqBefore mid=$seqMid after_race=$seqAfterRace final=$seqFinal"

  Write-Step "RESUMEN"
  $report | ForEach-Object { Write-Host $_ }
  Write-Host "OK — verificación local completada" -ForegroundColor Green
}
finally {
  Stop-DevServer
  # Restaurar mock local seguro
  Set-MockMode 'success'
}
