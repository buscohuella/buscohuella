function Write-Tree {

    param(
        [Parameter(Mandatory)]
        [string]$Path,

        [string]$Indent = "",

        [string[]]$Exclude = @(),

        [ref]$FileCounter,

        [ref]$FolderCounter
    )


    $items = Get-ChildItem `
        -LiteralPath $Path `
        -Force |
    Where-Object {

        $excluded = $false

        foreach ($pattern in $Exclude) {

            if ($_.Name -like $pattern) {

                $excluded = $true
                break

            }

        }

        -not $excluded

    } |
    Sort-Object @(
        @{
            Expression = {

                if ($_.Name -eq "README.md") {
                    0
                }
                elseif ($_.PSIsContainer) {
                    1
                }
                else {
                    2
                }

            }
        },
        @{
            Expression = {
                $_.Name
            }
        }
    )


    foreach ($item in $items) {


        if ($item.PSIsContainer) {

            $FolderCounter.Value++

            "$Indent├── 📁 $($item.Name)"


        }
        else {


            $FileCounter.Value++

            "$Indent├── 📄 $($item.Name)"


        }



        if ($item.PSIsContainer) {


            Write-Tree `
                -Path $item.FullName `
                -Indent "$Indent│   " `
                -Exclude $Exclude `
                -FileCounter $FileCounter `
                -FolderCounter $FolderCounter


        }

    }

}



function Get-ProjectTree {


    param(

        [Parameter(Mandatory)]
        [string]$Path

    )



    if (!(Test-Path $Path)) {

        throw "La ruta '$Path' no existe."

    }



    $exclude = @(

        ".git",
        ".github",
        "node_modules",
        ".expo",
        ".vscode",
        "dist",
        "build",
        "coverage",
        "project-tree.md",
        ".DS_Store",
        "Thumbs.db",
        "*.log",
        "*.tmp"

    )



    $fileCounter = 0

    $folderCounter = 0



    $root = Split-Path $Path -Leaf



    $tree = @(

        "🐾 $root"

        Write-Tree `
            -Path $Path `
            -Exclude $exclude `
            -FileCounter ([ref]$fileCounter) `
            -FolderCounter ([ref]$folderCounter)

    )



    return @{

        Tree = $tree

        Files = $fileCounter

        Folders = $folderCounter

        Total = $fileCounter + $folderCounter

        Excluded = $exclude

    }

}