
# Supabase Functions

Lista de Supabase Functions que se usan en la NurseEmergency App

## Generate PDF Function

Genera un PDF a partir de la información:

    - Tabla de Cambio_Turno
    - Almacenamiento de los recursos (firmas y logo)

Los parámetros que recibe la función:

```
{
    Nombre_completo_enfermero_solicitante: "string",
    ID_enfermero_solicitante: "string",
    Nombre_completo_enfermero_reemplazante: "string",
    ID_enfermero_reemplazante: "string",
    Nombre_Servicio: "string",
    Dia_solicitud: "date",
    Fecha-Hora_cambio_turno: "datetime",
    Razon_solicitud: "string,
    Firma_coordinadora_servicio: "image",
    Firma_jefa_enfermeria: "image",
    Logo_essalud: "image"
}
```

## Send Notification Function

Soon...

## Put your function

Write your function.
