. "$PSScriptRoot\lib\ProjectTree.ps1"

Clear-Host


# ==================================================
# CONFIGURACIÓN
# ==================================================

$projectRoot = Split-Path $PSScriptRoot -Parent

$outputFile = Join-Path $projectRoot "docs\project-tree.md"

$docsRoot = Join-Path $projectRoot "docs"

$fecha = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$cliVersion = "v1.1"



# ==================================================
# ICONOS DOCUMENTOS
# ==================================================

function Get-DocumentIcon {

param(
    [string]$FileName
)


$name = $FileName.ToUpper()



switch -Regex ($name) {


# ------------------------------------------
# README / INDEX
# ------------------------------------------

"README|INDEX" {
    return "📘"
}



# ------------------------------------------
# ADR / DECISIONES
# ------------------------------------------

"^ADR-|ADR_" {
    return "📌"
}


"^DR-|REJECTED|REJECTED_DECISION" {
    return "🚫"
}



# ------------------------------------------
# ARQUITECTURA
# ------------------------------------------

"SYSTEM|ARCHITECTURE|DIAGRAM" {
    return "🏗️"
}



# ------------------------------------------
# DATABASE
# ------------------------------------------

"DATABASE|SCHEMA|SQL|MIGRATION|TABLE|ENTITY" {
    return "🗄️"
}



# ------------------------------------------
# SEGURIDAD
# ------------------------------------------

"AUTH|JWT|ENCRYPT|SECURITY" {
    return "🔐"
}



# ------------------------------------------
# MOBILE
# ------------------------------------------

"MOBILE|APP|REACT_NATIVE|EXPO" {
    return "📱"
}



# ------------------------------------------
# FRONTEND
# ------------------------------------------

"FRONTEND|ANGULAR|REACT|COMPONENT|STYLE" {
    return "🎨"
}



# ------------------------------------------
# BACKEND / API
# ------------------------------------------

"BACKEND|API|SERVER|ENDPOINT" {
    return "⚙️"
}



# ------------------------------------------
# PRODUCT
# ------------------------------------------

"MVP|VISION|PRODUCT|PERSONA|USER_FLOW|USER-STORY|FEATURE" {
    return "📦"
}



# ------------------------------------------
# ROADMAP
# ------------------------------------------

"ROADMAP|MILESTONE|PLAN|TIMELINE" {
    return "🗺️"
}



# ------------------------------------------
# TESTING
# ------------------------------------------

"TEST|QA|QUALITY" {
    return "🧪"
}



# ------------------------------------------
# LEGAL
# ------------------------------------------

"LEGAL|TERMS|PRIVACY|COOKIE|POLICY|LICENSE|COMPLIANCE|GDPR|RGPD" {
    return "⚖️"
}



# ------------------------------------------
# MARKETING
# ------------------------------------------

"MARKETING|CAMPAIGN|ONEPAGER" {
    return "📢"
}



# ------------------------------------------
# OPERATIONS
# ------------------------------------------

"OPERATION|SUPPORT|MODERATION|LAUNCH|PROCESS" {
    return "🚀"
}



# ------------------------------------------
# AI
# ------------------------------------------

"^AI_|ARTIFICIAL|INTELLIGENCE|MACHINE|LLM" {
    return "🤖"
}



# ------------------------------------------
# DEFAULT
# ------------------------------------------

default {
    return "📄"
}


}

}




# ==================================================
# SECCIONES DOCUMENTACIÓN
# ==================================================

function Get-SectionInfo {

param(
    [string]$Folder
)


switch($Folder.ToLower()) {


"adr" {
    return @{
        Name="Architecture Decision Records (ADR)"
        Icon="📌"
    }
}


"ai" {
    return @{
        Name="Artificial Intelligence"
        Icon="🤖"
    }
}


"api" {
    return @{
        Name="API"
        Icon="🔌"
    }
}


"architecture" {
    return @{
        Name="Architecture"
        Icon="🏗️"
    }
}


"backend" {
    return @{
        Name="Backend"
        Icon="⚙️"
    }
}


"database" {
    return @{
        Name="Database"
        Icon="🗄️"
    }
}


"decisions" {
    return @{
        Name="Decision Records"
        Icon="📌"
    }
}


"deployment" {
    return @{
        Name="Deployment"
        Icon="🚢"
    }
}


"frontend" {
    return @{
        Name="Frontend"
        Icon="🎨"
    }
}


"glossary" {
    return @{
        Name="Glossary"
        Icon="📚"
    }
}


"legal" {
    return @{
        Name="Legal"
        Icon="⚖️"
    }
}


"marketing" {
    return @{
        Name="Marketing"
        Icon="📢"
    }
}


"master" {
    return @{
        Name="Master Documentation"
        Icon="📚"
    }
}


"mobile" {
    return @{
        Name="Mobile"
        Icon="📱"
    }
}


"operations" {
    return @{
        Name="Operations"
        Icon="🚀"
    }
}


"product" {
    return @{
        Name="Product"
        Icon="📦"
    }
}


"rejected-decisions" {
    return @{
        Name="Rejected Decisions"
        Icon="🚫"
    }
}


"roadmap" {
    return @{
        Name="Roadmap"
        Icon="🗺️"
    }
}


"security" {
    return @{
        Name="Security"
        Icon="🔐"
    }
}


"technical" {
    return @{
        Name="Technical"
        Icon="🧰"
    }
}


"testing" {
    return @{
        Name="Testing"
        Icon="🧪"
    }
}


default {

    return @{
        Name=$Folder
        Icon="📁"
    }

}


}

}





# ==================================================
# RUTA MARKDOWN
# ==================================================

function Convert-ToMarkdownPath {

param(
    [string]$Path
)


return $Path.Replace("\","/")


}



function Get-RelativePath {


param(
    [string]$File,
    [string]$Root
)


$relative = $File.Replace($Root,"")


return $relative.TrimStart("\","/")


}



# ==================================================
# LINKS DOCUMENTACIÓN
# ==================================================

function Get-MarkdownLinks {


param(
[string]$DocsPath,
[string]$ProjectRoot
)


$result=@()



if(!(Test-Path $DocsPath)){
return $result
}



$files=Get-ChildItem `
-Path $DocsPath `
-Recurse `
-Filter "*.md" |
Where-Object{

$_.Name -ne "project-tree.md"

}



# raíz

$root=$files |
Where-Object{
$_.DirectoryName -eq $DocsPath
}



if($root.Count -gt 0){


$result += ""

$result += "<details>"

$result += "<summary>📚 Documentos principales ($($root.Count))</summary>"

$result += ""


foreach($file in $root){


$name=[IO.Path]::GetFileNameWithoutExtension($file.Name)

$result += "- 📘 [$name](./$($file.Name))"


}


$result += ""

$result += "</details>"

$result += ""

}



# carpetas

$groups=$files |
Where-Object{
$_.DirectoryName -ne $DocsPath
} |
Group-Object {


$_.FullName.Replace($DocsPath,"").TrimStart("\").Split("\")[0]


}



foreach($group in ($groups | Sort-Object Name)){


$section=Get-SectionInfo $group.Name


$result += ""

$result += "<details>"

$result += "<summary>$($section.Icon) $($section.Name) $(if($group.Count -eq 1){"1 documento"}else{"$($group.Count) documentos"})</summary>"

$result += ""


foreach($file in ($group.Group | Sort-Object Name)){


$relative=Get-RelativePath `
$file.FullName `
$DocsPath


$relative=Convert-ToMarkdownPath $relative


$name=[IO.Path]::GetFileNameWithoutExtension($file.Name)


$icon=Get-DocumentIcon $file.Name


$result += "- $icon [$name](./$relative)"


}


$result += ""

$result += "</details>"

$result += ""


}



return $result

}




# ==================================================
# EJECUCIÓN
# ==================================================


Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan

Write-Host " 🐾 BUSCOHUELLA TREE GENERATOR"

Write-Host "=========================================" -ForegroundColor Cyan


try{


$result=Get-ProjectTree `
-Path $projectRoot



$docsCount=(Get-ChildItem `
$docsRoot `
-Recurse `
-Filter "*.md" |
Where-Object{
$_.Name -ne "project-tree.md"
}).Count



$content=@(

"# 🐾 BuscoHuella - Estructura del proyecto"

""

"> Documento generado automáticamente por BuscoHuella CLI"

""

"---"

""

"## 📊 Información"

""

"| Dato | Valor |"

"|---|---|"

"| Generado | $fecha |"

"| Generador | BuscoHuella CLI |"

"| Versión | $cliVersion |"

"| Ruta | ``$projectRoot`` |"

"| Carpetas | $($result.Folders) |"

"| Archivos | $($result.Files) |"

"| Documentación | $docsCount |"

"| Total | $($result.Total) |"

""

"---"

""

"## 🔗 Documentación"

""

)



$content += Get-MarkdownLinks `
-DocsPath $docsRoot `
-ProjectRoot $projectRoot



$content += @(

""

"---"

""

"## 🚫 Elementos excluidos"

""

)



foreach($item in $result.Excluded){

$content += "- $item"

}



$content += @(

""

"---"

""

"## 🌳 Árbol del proyecto"

""

'```text'

)



$content += $result.Tree


$content += '```'



$content |
Out-File `
$outputFile `
-Encoding utf8



Write-Host ""

Write-Host "✅ Generado correctamente" -ForegroundColor Green

Write-Host $outputFile -ForegroundColor Cyan


}


catch{


Write-Host ""

Write-Host "❌ Error:" -ForegroundColor Red

Write-Host $_.Exception.Message


}



Read-Host "Pulse ENTER para volver"