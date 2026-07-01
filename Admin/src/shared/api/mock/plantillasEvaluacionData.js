// Plantillas guardadas de evaluaciones
export const plantillasEvaluacion = [
  {
    id: 1,
    nombre: 'Seguridad Básica en Minería',
    descripcion: 'Preguntas básicas sobre seguridad en operaciones mineras, EPP y protocolos de emergencia',
    numeroPreguntas: 5,
    fechaCreacion: '2025-01-05',
    preguntas: [
      {
        id: 1,
        tipo: 'opcion-multiple',
        pregunta: '¿Cuál es el equipo de protección personal obligatorio en minería subterránea?',
        opciones: [
          { id: 1, texto: 'Casco, botas y guantes', correcta: false },
          { id: 2, texto: 'Casco, lámpara, botas de seguridad y respirador', correcta: true },
          { id: 3, texto: 'Solo casco y botas', correcta: false },
          { id: 4, texto: 'Guantes y gafas de seguridad', correcta: false },
        ],
      },
      {
        id: 2,
        tipo: 'opcion-multiple',
        pregunta: '¿Qué hacer en caso de derrumbe en una mina?',
        opciones: [
          { id: 1, texto: 'Correr hacia la salida inmediatamente', correcta: false },
          { id: 2, texto: 'Buscar un área segura y activar el protocolo de emergencia', correcta: true },
          { id: 3, texto: 'Esperar instrucciones sin moverse', correcta: false },
          { id: 4, texto: 'Intentar limpiar el derrumbe', correcta: false },
        ],
      },
      {
        id: 3,
        tipo: 'opcion-multiple',
        pregunta: '¿Con qué frecuencia se debe inspeccionar el equipo de protección personal?',
        opciones: [
          { id: 1, texto: 'Una vez al mes', correcta: false },
          { id: 2, texto: 'Antes de cada turno de trabajo', correcta: true },
          { id: 3, texto: 'Cuando se vea dañado', correcta: false },
          { id: 4, texto: 'Una vez al año', correcta: false },
        ],
      },
      {
        id: 4,
        tipo: 'respuesta-corta',
        pregunta: 'Mencione tres riesgos principales en minería subterránea',
        respuestaCorrecta: 'Derrumbes, gases tóxicos, falta de oxígeno, caídas, explosiones',
      },
      {
        id: 5,
        tipo: 'respuesta-corta',
        pregunta: '¿Qué medidas debe tomar antes de ingresar a una zona de trabajo en la mina?',
        respuestaCorrecta: 'Verificar ventilación, inspeccionar el área, usar EPP completo, comunicar ingreso',
      },
    ],
  },
  {
    id: 2,
    nombre: 'Manejo de Maquinaria Pesada',
    descripcion: 'Evaluación sobre operación segura de equipos y maquinaria pesada en diferentes industrias',
    numeroPreguntas: 6,
    fechaCreacion: '2025-01-08',
    preguntas: [
      {
        id: 1,
        tipo: 'opcion-multiple',
        pregunta: '¿Qué debe verificar antes de operar maquinaria pesada?',
        opciones: [
          { id: 1, texto: 'Solo el nivel de combustible', correcta: false },
          { id: 2, texto: 'Frenos, luces, niveles de fluidos, neumáticos y sistemas de seguridad', correcta: true },
          { id: 3, texto: 'Solo que encienda', correcta: false },
          { id: 4, texto: 'Nada, si funcionó ayer', correcta: false },
        ],
      },
      {
        id: 2,
        tipo: 'opcion-multiple',
        pregunta: '¿Cuál es la distancia mínima de seguridad al operar grúas?',
        opciones: [
          { id: 1, texto: '2 metros', correcta: false },
          { id: 2, texto: '5 metros', correcta: false },
          { id: 3, texto: '10 metros o según el radio de giro de la carga', correcta: true },
          { id: 4, texto: 'No hay distancia mínima', correcta: false },
        ],
      },
      {
        id: 3,
        tipo: 'opcion-multiple',
        pregunta: '¿Qué hacer si detecta una falla durante la operación?',
        opciones: [
          { id: 1, texto: 'Continuar hasta terminar la tarea', correcta: false },
          { id: 2, texto: 'Detener inmediatamente, apagar y reportar', correcta: true },
          { id: 3, texto: 'Acelerar para terminar rápido', correcta: false },
          { id: 4, texto: 'Ignorar si es menor', correcta: false },
        ],
      },
      {
        id: 4,
        tipo: 'opcion-multiple',
        pregunta: '¿Quién puede operar maquinaria pesada?',
        opciones: [
          { id: 1, texto: 'Cualquier trabajador disponible', correcta: false },
          { id: 2, texto: 'Solo personal certificado y autorizado', correcta: true },
          { id: 3, texto: 'Cualquiera con licencia de conducir', correcta: false },
        ],
      },
      {
        id: 5,
        tipo: 'respuesta-corta',
        pregunta: 'Enumere tres señales de advertencia que debe tener la maquinaria pesada',
        respuestaCorrecta: 'Alarma de retroceso, luces intermitentes, bocina, señales visuales de advertencia',
      },
      {
        id: 6,
        tipo: 'respuesta-corta',
        pregunta: '¿Qué procedimiento debe seguir al finalizar la operación de la maquinaria?',
        respuestaCorrecta: 'Estacionar en zona segura, apagar motor, activar freno de mano, retirar llave, reportar novedades',
      },
    ],
  },
  {
    id: 3,
    nombre: 'Primeros Auxilios y Emergencias',
    descripcion: 'Conocimientos básicos de primeros auxilios y respuesta ante emergencias laborales',
    numeroPreguntas: 7,
    fechaCreacion: '2025-01-12',
    preguntas: [
      {
        id: 1,
        tipo: 'opcion-multiple',
        pregunta: '¿Cuál es el primer paso ante una emergencia médica?',
        opciones: [
          { id: 1, texto: 'Llamar a la familia del accidentado', correcta: false },
          { id: 2, texto: 'Evaluar la escena y garantizar seguridad propia', correcta: true },
          { id: 3, texto: 'Mover al herido inmediatamente', correcta: false },
          { id: 4, texto: 'Dar agua al herido', correcta: false },
        ],
      },
      {
        id: 2,
        tipo: 'opcion-multiple',
        pregunta: '¿Qué debe hacer si una persona está sangrando abundantemente?',
        opciones: [
          { id: 1, texto: 'Aplicar torniquete inmediatamente', correcta: false },
          { id: 2, texto: 'Aplicar presión directa sobre la herida con material limpio', correcta: true },
          { id: 3, texto: 'Lavar la herida con agua', correcta: false },
          { id: 4, texto: 'Dejar que sangre para limpiar la herida', correcta: false },
        ],
      },
      {
        id: 3,
        tipo: 'opcion-multiple',
        pregunta: '¿Cuándo NO se debe mover a una persona accidentada?',
        opciones: [
          { id: 1, texto: 'Nunca se debe mover', correcta: false },
          { id: 2, texto: 'Cuando se sospecha lesión de columna o cuello, salvo peligro inminente', correcta: true },
          { id: 3, texto: 'Siempre se puede mover', correcta: false },
          { id: 4, texto: 'Solo si está consciente', correcta: false },
        ],
      },
      {
        id: 4,
        tipo: 'opcion-multiple',
        pregunta: '¿Qué hacer si alguien sufre una quemadura?',
        opciones: [
          { id: 1, texto: 'Aplicar hielo directamente', correcta: false },
          { id: 2, texto: 'Aplicar mantequilla o aceite', correcta: false },
          { id: 3, texto: 'Enfriar con agua corriente fría durante 10-20 minutos', correcta: true },
          { id: 4, texto: 'Reventar las ampollas', correcta: false },
        ],
      },
      {
        id: 5,
        tipo: 'opcion-multiple',
        pregunta: '¿Dónde debe ubicarse el botiquín de primeros auxilios?',
        opciones: [
          { id: 1, texto: 'En cualquier lugar', correcta: false },
          { id: 2, texto: 'En lugar accesible, señalizado y conocido por todos', correcta: true },
          { id: 3, texto: 'Bajo llave en la oficina', correcta: false },
        ],
      },
      {
        id: 6,
        tipo: 'respuesta-corta',
        pregunta: 'Mencione 5 elementos básicos que debe contener un botiquín de primeros auxilios',
        respuestaCorrecta: 'Vendas, gasas, antiséptico, guantes, tijeras, esparadrapo, analgésicos, solución salina',
      },
      {
        id: 7,
        tipo: 'respuesta-corta',
        pregunta: '¿Qué significa RCP y cuándo se aplica?',
        respuestaCorrecta: 'Reanimación Cardiopulmonar, se aplica cuando una persona no respira y no tiene pulso',
      },
    ],
  },
];
