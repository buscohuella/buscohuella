Clear-Host

function Show-Menu {

    Clear-Host

    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host "         BUSCOHUELLA CLI v1.0" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "[1] Estructura del proyecto"
    Write-Host "[2] Estadísticas"
    Write-Host "[3] Índice de documentación"
    Write-Host "[4] Buscar archivo"
    Write-Host "[5] Backup"
    Write-Host "[6] Limpiar temporales"
    Write-Host "[7] Actualizar documentación"
    Write-Host "[8] Configuración"

    Write-Host ""
    Write-Host "[0] Salir"

    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Show-NotImplemented {

    Write-Host ""
    Write-Host "Esta funcionalidad todavía no está implementada." -ForegroundColor Yellow
    Write-Host ""

    Read-Host "Pulse ENTER para continuar"
}

while ($true) {

    Show-Menu

    $option = Read-Host "Seleccione una opción"

    switch ($option) {

        "1" {

            try {

                & "$PSScriptRoot\tree.ps1"

            }
            catch {

                Write-Host ""
                Write-Host "Se ha producido un error al ejecutar tree.ps1." -ForegroundColor Red
                Write-Host $_.Exception.Message -ForegroundColor Red
                Write-Host ""

                Read-Host "Pulse ENTER para continuar"

            }

        }

        "2" {

            Show-NotImplemented

        }

        "3" {

            Show-NotImplemented

        }

        "4" {

            Show-NotImplemented

        }

        "5" {

            Show-NotImplemented

        }

        "6" {

            Show-NotImplemented

        }

        "7" {

            Show-NotImplemented

        }

        "8" {

            Show-NotImplemented

        }

        "0" {

            Clear-Host

            Write-Host ""
            Write-Host "Gracias por utilizar BuscoHuella CLI." -ForegroundColor Green
            Write-Host ""

            exit

        }

        default {

            Write-Host ""
            Write-Host "La opción seleccionada no es válida." -ForegroundColor Red
            Write-Host ""

            Read-Host "Pulse ENTER para continuar"

        }

    }

}