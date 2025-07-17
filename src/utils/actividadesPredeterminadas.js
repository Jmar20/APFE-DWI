// Plantillas de actividades predeterminadas por tipo de cultivo
export const actividadesPredeterminadas = {
  // TOMATES
  'tomate': [
    {
      nombre: 'Preparación del suelo',
      descripcion: 'Arar, nivelar y preparar el suelo para la siembra de tomates',
      diasDesdeSiembra: 0,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Siembra/Transplante',
      descripcion: 'Plantar las semillas o plántulas de tomate en la parcela',
      diasDesdeSiembra: 1,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Primer riego',
      descripcion: 'Riego inicial abundante para establecer las raíces',
      diasDesdeSiembra: 2,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Fertilización inicial',
      descripcion: 'Aplicar fertilizante rico en fósforo para el desarrollo radicular',
      diasDesdeSiembra: 15,
      prioridad: 'MEDIA'
    },
    {
      nombre: 'Tutorado y poda',
      descripcion: 'Instalar tutores y realizar poda de brotes laterales',
      diasDesdeSiembra: 30,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Cosecha',
      descripcion: 'Recolección de tomates maduros',
      diasDesdeSiembra: 120,
      prioridad: 'ALTA'
    }
  ],

  // LECHUGAS
  'lechuga': [
    {
      nombre: 'Preparación del suelo',
      descripcion: 'Preparar bancales con suelo suelto y bien drenado',
      diasDesdeSiembra: 0,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Siembra directa',
      descripcion: 'Sembrar semillas de lechuga directamente en surcos',
      diasDesdeSiembra: 1,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Riego por aspersión',
      descripcion: 'Mantener humedad constante sin encharcar',
      diasDesdeSiembra: 2,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Raleo de plántulas',
      descripcion: 'Eliminar plántulas débiles, dejar 15cm entre plantas',
      diasDesdeSiembra: 20,
      prioridad: 'MEDIA'
    },
    {
      nombre: 'Fertilización foliar',
      descripcion: 'Aplicar fertilizante líquido rico en nitrógeno',
      diasDesdeSiembra: 35,
      prioridad: 'MEDIA'
    },
    {
      nombre: 'Cosecha',
      descripcion: 'Cortar lechugas cuando estén firmes y compactas',
      diasDesdeSiembra: 60,
      prioridad: 'ALTA'
    }
  ],

  // PAPAS
  'papa': [
    {
      nombre: 'Preparación del terreno',
      descripcion: 'Arar profundo y formar surcos para la siembra',
      diasDesdeSiembra: 0,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Plantación de tubérculos',
      descripcion: 'Plantar papas semilla en surcos a 30cm de distancia',
      diasDesdeSiembra: 1,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Primer aporque',
      descripcion: 'Cubrir brotes con tierra cuando tengan 15cm de altura',
      diasDesdeSiembra: 25,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Fertilización',
      descripcion: 'Aplicar fertilizante completo NPK en el aporque',
      diasDesdeSiembra: 30,
      prioridad: 'MEDIA'
    },
    {
      nombre: 'Segundo aporque',
      descripcion: 'Realizar segundo aporque para aumentar producción',
      diasDesdeSiembra: 50,
      prioridad: 'MEDIA'
    },
    {
      nombre: 'Cosecha',
      descripcion: 'Recolectar papas cuando las hojas estén amarillas',
      diasDesdeSiembra: 90,
      prioridad: 'ALTA'
    }
  ],

  // ZANAHORIAS
  'zanahoria': [
    {
      nombre: 'Preparación del suelo',
      descripcion: 'Preparar suelo suelto y sin piedras, profundidad 25cm',
      diasDesdeSiembra: 0,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Siembra en líneas',
      descripcion: 'Sembrar semillas en surcos poco profundos',
      diasDesdeSiembra: 1,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Riego suave',
      descripcion: 'Mantener humedad constante con riego por goteo',
      diasDesdeSiembra: 2,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Raleo de plantas',
      descripcion: 'Dejar 5cm entre plantas, eliminar las más débiles',
      diasDesdeSiembra: 25,
      prioridad: 'MEDIA'
    },
    {
      nombre: 'Fertilización potásica',
      descripcion: 'Aplicar fertilizante rico en potasio para el desarrollo',
      diasDesdeSiembra: 45,
      prioridad: 'MEDIA'
    },
    {
      nombre: 'Cosecha',
      descripcion: 'Extraer zanahorias cuando tengan el tamaño deseado',
      diasDesdeSiembra: 90,
      prioridad: 'ALTA'
    }
  ],

  // CEBOLLAS
  'cebolla': [
    {
      nombre: 'Preparación del suelo',
      descripcion: 'Preparar suelo bien drenado y rico en materia orgánica',
      diasDesdeSiembra: 0,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Plantación de bulbos',
      descripcion: 'Plantar bulbillos o plántulas a 10cm de distancia',
      diasDesdeSiembra: 1,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Riego establecimiento',
      descripcion: 'Riego moderado para el establecimiento inicial',
      diasDesdeSiembra: 2,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Control de malezas',
      descripcion: 'Eliminar malas hierbas que compitan por nutrientes',
      diasDesdeSiembra: 30,
      prioridad: 'MEDIA'
    },
    {
      nombre: 'Fertilización nitrogenada',
      descripcion: 'Aplicar fertilizante rico en nitrógeno para el crecimiento',
      diasDesdeSiembra: 60,
      prioridad: 'MEDIA'
    },
    {
      nombre: 'Cosecha',
      descripcion: 'Recolectar cuando las hojas estén secas y amarillas',
      diasDesdeSiembra: 120,
      prioridad: 'ALTA'
    }
  ],

  // PIMIENTOS
  'pimiento': [
    {
      nombre: 'Preparación del suelo',
      descripcion: 'Preparar suelo suelto con buen drenaje y pH 6.0-7.0',
      diasDesdeSiembra: 0,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Transplante',
      descripcion: 'Trasplantar plántulas cuando tengan 6-8 hojas verdaderas',
      diasDesdeSiembra: 1,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Riego por goteo',
      descripcion: 'Instalar sistema de riego y mantener humedad constante',
      diasDesdeSiembra: 2,
      prioridad: 'ALTA'
    },
    {
      nombre: 'Tutorado',
      descripcion: 'Instalar tutores para sostener las plantas cargadas',
      diasDesdeSiembra: 25,
      prioridad: 'MEDIA'
    },
    {
      nombre: 'Fertilización completa',
      descripcion: 'Aplicar fertilizante NPK para floración y fructificación',
      diasDesdeSiembra: 45,
      prioridad: 'MEDIA'
    },
    {
      nombre: 'Cosecha',
      descripcion: 'Recolectar pimientos cuando estén firmes y coloridos',
      diasDesdeSiembra: 90,
      prioridad: 'ALTA'
    }
  ]
};

// Función para obtener actividades por tipo de cultivo
export const obtenerActividadesPorTipo = (tipoCultivo) => {
  const tipo = tipoCultivo.toLowerCase();
  return actividadesPredeterminadas[tipo] || actividadesPredeterminadas['tomate']; // Default a tomate
};

// Función para calcular fechas de actividades basadas en fecha de siembra
export const calcularFechasActividades = (fechaSiembra, actividadesTemplate) => {
  const fechaBase = new Date(fechaSiembra);
  
  return actividadesTemplate.map(actividad => ({
    ...actividad,
    fechaEjecucion: calcularFechaActividad(fechaBase, actividad.diasDesdeSiembra)
  }));
};

// Función auxiliar para calcular fecha de actividad
const calcularFechaActividad = (fechaBase, dias) => {
  const fecha = new Date(fechaBase);
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};
