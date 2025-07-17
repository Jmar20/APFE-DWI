// Modo mock para desarrollo sin backend
export const mockMode = {
  enabled: false, // ✅ DESACTIVADO: Backend está disponible en puerto 8080
  
  // Datos simulados
  mockCultivos: [
    {
      id: 1,
      tipo: 'Tomates',
      variedad: 'Cherry',
      fechaSiembra: '2025-07-01',
      fechaCosechaEstimada: '2025-10-01',
      estado: 'ACTIVO',
      userId: 25,
      descripcion: 'Cultivo de tomates cherry orgánicos'
    },
    {
      id: 2,
      tipo: 'Lechugas',
      variedad: 'Romana',
      fechaSiembra: '2025-07-10',
      fechaCosechaEstimada: '2025-08-25',
      estado: 'ACTIVO',
      userId: 25,
      descripcion: 'Lechugas hidropónicas'
    }
  ],
  
  // Simular respuestas exitosas
  mockResponses: {
    createCultivo: (data) => ({
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    }),
    
    getCultivos: (userId) => {
      return mockMode.mockCultivos.filter(c => c.userId === userId);
    }
  }
};

export default mockMode;
