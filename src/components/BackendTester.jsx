import React, { useState } from 'react';
import { Button, Box, Typography, Alert, TextField } from '@mui/material';
import api from '../services/api';

const BackendTester = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (endpoint, method, status, data, error = null) => {
    const result = {
      endpoint,
      method,
      status,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    };
    setResults(prev => [result, ...prev]);
  };

  const testEndpoint = async (endpoint, method = 'GET', data = null) => {
    setLoading(true);
    try {
      let response;
      const fullUrl = `/gestioncultivo${endpoint}`;
      
      switch (method) {
        case 'GET':
          response = await api.get(fullUrl);
          break;
        case 'POST':
          response = await api.post(fullUrl, data);
          break;
        case 'DELETE':
          response = await api.delete(fullUrl);
          break;
        case 'PUT':
          response = await api.put(fullUrl, data);
          break;
        default:
          throw new Error('Método no soportado');
      }
      
      addResult(fullUrl, method, response.status, response.data);
      console.log(`✅ ${method} ${fullUrl}:`, response.data);
    } catch (error) {
      addResult(endpoint, method, error.response?.status || 'ERROR', error.response?.data || error.message, error.message);
      console.error(`❌ ${method} ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const testAllEndpoints = async () => {
    setResults([]);
    
    // Probar diferentes endpoints posibles
    const endpointsToTest = [
      { endpoint: '/cultivos', method: 'GET' },
      { endpoint: '/cultivos/all', method: 'GET' },
      { endpoint: '/cultivos/lista', method: 'GET' },
      { endpoint: '/cultivos/usuario/25', method: 'GET' },
      { endpoint: '/cultivos/user/25', method: 'GET' },
      { endpoint: '/cultivos/byUser/25', method: 'GET' },
      { endpoint: '/cultivos/1', method: 'GET' },
      { endpoint: '/cultivos/20', method: 'GET' },
      { endpoint: '/cultivos/19', method: 'GET' },
    ];

    for (const test of endpointsToTest) {
      await testEndpoint(test.endpoint, test.method);
      // Esperar un poco entre requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const testCultivoCreation = async () => {
    setResults([]);
    
    // Test de creación de cultivo
    const cultivoTest = {
      tipo: 'TEST-CULTIVO',
      fechaSiembra: '2025-07-13',
      parcelaId: 1,
      userId: 25
    };
    
    try {
      console.log('🧪 Probando creación de cultivo:', cultivoTest);
      await testEndpoint('/cultivos', 'POST', cultivoTest);
      
      // Esperar un poco y luego verificar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🧪 Verificando cultivos del usuario después de crear...');
      await testEndpoint('/cultivos/usuario/25', 'GET');
      
    } catch (error) {
      console.error('❌ Error en test de creación:', error);
    }
  };

  const testInvestigacion = async () => {
    setResults([]);
    
    console.log('🔍 INVESTIGACIÓN COMPLETA DEL PROBLEMA');
    
    // 1. Crear cultivo con diferentes variaciones de userId
    const tests = [
      { 
        nombre: 'TEST-1-userId-number',
        data: { tipo: 'TEST-1', fechaSiembra: '2025-07-13', parcelaId: 1, userId: 25 }
      },
      { 
        nombre: 'TEST-2-userId-string',
        data: { tipo: 'TEST-2', fechaSiembra: '2025-07-13', parcelaId: 1, userId: "25" }
      },
      { 
        nombre: 'TEST-3-usuarioId',
        data: { tipo: 'TEST-3', fechaSiembra: '2025-07-13', parcelaId: 1, usuarioId: 25 }
      },
      { 
        nombre: 'TEST-4-usuario_id',
        data: { tipo: 'TEST-4', fechaSiembra: '2025-07-13', parcelaId: 1, usuario_id: 25 }
      }
    ];

    for (const test of tests) {
      console.log(`🧪 Probando ${test.nombre}:`, test.data);
      await testEndpoint('/cultivos', 'POST', test.data);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 2. Verificar si alguno aparece
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('🔍 Verificando si algún test aparece en usuario 25...');
    await testEndpoint('/cultivos/usuario/25', 'GET');
    
    // 3. Intentar otros userIds por si acaso
    console.log('🔍 Probando otros userIds...');
    await testEndpoint('/cultivos/usuario/1', 'GET');
    await testEndpoint('/cultivos/usuario/0', 'GET');
  };

  const testValidacionFinal = async () => {
    setResults([]);
    
    console.log('✅ VERIFICANDO QUE EL BACKEND ESTÁ ARREGLADO');
    
    // 1. Crear un cultivo nuevo para probar
    const cultivoTest = {
      tipo: 'VERIFICACION-FIX',
      fechaSiembra: '2025-07-13',
      parcelaId: 1,
      userId: 25
    };
    
    console.log('🧪 Paso 1: Creando cultivo de verificación...');
    await testEndpoint('/cultivos', 'POST', cultivoTest);
    
    // 2. Esperar un poco
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. Verificar que ahora SÍ aparece
    console.log('🔍 Paso 2: Verificando que aparece en la lista del usuario...');
    await testEndpoint('/cultivos/usuario/25', 'GET');
    
    // 4. Verificar que el cultivo incluye userId en la respuesta
    console.log('🔍 Paso 3: Verificando estructura de respuesta...');
    
    console.log('🎉 ¡Verificación completa! Revisa los resultados arriba.');
  };

  const testDelete = async () => {
    setResults([]);
    
    console.log('🗑️ PROBANDO ELIMINAR CULTIVOS');
    
    // 1. Primero crear un cultivo para eliminar
    const cultivoTest = {
      tipo: 'TEST-PARA-ELIMINAR',
      fechaSiembra: '2025-07-13',
      parcelaId: 1,
      userId: 25
    };
    
    console.log('🧪 Paso 1: Creando cultivo para eliminar...');
    let cultivoCreado = null;
    
    try {
      const response = await api.post('/gestioncultivo/cultivos', cultivoTest);
      cultivoCreado = response.data;
      addResult('/gestioncultivo/cultivos', 'POST', response.status, response.data);
      console.log('✅ Cultivo creado con ID:', cultivoCreado.id);
      
      // 2. Esperar un poco
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 3. Intentar eliminarlo
      console.log('🗑️ Paso 2: Intentando eliminar cultivo ID:', cultivoCreado.id);
      await testEndpoint(`/cultivos/${cultivoCreado.id}`, 'DELETE');
      
      // 4. Verificar que se eliminó
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('🔍 Paso 3: Verificando que se eliminó...');
      await testEndpoint('/cultivos/usuario/25', 'GET');
      
    } catch (error) {
      console.error('❌ Error en test de eliminación:', error);
      addResult('/cultivos/delete', 'ERROR', 'ERROR', error.message, error.message);
    }
  };

  const testUpdate = async () => {
    setResults([]);
    
    console.log('📝 PROBANDO ACTUALIZAR CULTIVOS CON CAMPOS COMPLETOS');
    
    // 1. Primero crear un cultivo para actualizar CON TODOS LOS CAMPOS
    const cultivoTest = {
      tipo: 'TEST-PARA-ACTUALIZAR',
      variedad: 'TEST-VARIEDAD',
      fechaSiembra: '2025-07-13',
      fechaCosechaEstimada: '2025-11-13',
      estado: 'PLANTADO',
      parcelaId: 1,
      userId: 25
    };
    
    console.log('🧪 Paso 1: Creando cultivo para actualizar...');
    let cultivoCreado = null;
    
    try {
      const response = await api.post('/gestioncultivo/cultivos', cultivoTest);
      cultivoCreado = response.data;
      addResult('/gestioncultivo/cultivos', 'POST', response.status, response.data);
      console.log('✅ Cultivo creado con ID:', cultivoCreado.id);
      
      // 2. Esperar un poco
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 3. Intentar actualizarlo CON TODOS LOS CAMPOS
      const datosActualizados = {
        tipo: 'TEST-ACTUALIZADO-COMPLETO',
        variedad: 'VARIEDAD-ACTUALIZADA-PREMIUM',
        fechaSiembra: '2025-07-14',
        fechaCosechaEstimada: '2025-11-14',
        estado: 'CRECIENDO',
        parcelaId: 2,
        userId: 25
      };
      
      console.log('📝 Paso 2: Actualizando cultivo ID con TODOS los campos:', cultivoCreado.id);
      await testEndpoint(`/cultivos/${cultivoCreado.id}`, 'PUT', datosActualizados);
      
      // 4. Verificar que se actualizó
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('🔍 Paso 3: Verificando que se actualizó...');
      await testEndpoint('/cultivos/usuario/25', 'GET');
      
    } catch (error) {
      console.error('❌ Error en test de actualización:', error);
      addResult('/cultivos/update', 'ERROR', 'ERROR', error.message, error.message);
    }
  };

  const testParcelas = async () => {
    setResults([]);
    
    console.log('🔍 INVESTIGANDO DÓNDE ESTÁN TUS 10 PARCELAS');
    
    try {
      // 1. Primero obtener TODAS las parcelas y analizar usuarios
      console.log('📋 Paso 1: Obteniendo TODAS las parcelas para analizar usuarios...');
      const responseAll = await api.get('/gestioncultivo/parcelas');
      const todasParcelas = responseAll.data;
      addResult('/gestioncultivo/parcelas', 'GET', responseAll.status, responseAll.data);
      
      console.log('📊 ANÁLISIS DE USUARIOS EN PARCELAS:');
      console.log('- Total parcelas en sistema:', todasParcelas.length);
      
      // Agrupar por usuarioId
      const parcelasPorUsuario = {};
      todasParcelas.forEach(parcela => {
        const userId = parcela.usuarioId || parcela.userId || 'SIN_USUARIO';
        if (!parcelasPorUsuario[userId]) {
          parcelasPorUsuario[userId] = [];
        }
        parcelasPorUsuario[userId].push(parcela);
      });
      
      console.log('👥 DISTRIBUCIÓN POR USUARIOS:');
      Object.keys(parcelasPorUsuario).forEach(userId => {
        const cantidad = parcelasPorUsuario[userId].length;
        console.log(`- Usuario ${userId}: ${cantidad} parcelas`);
        
        // Mostrar nombres de las primeras 3 parcelas
        const ejemplos = parcelasPorUsuario[userId].slice(0, 3).map(p => p.nombre).join(', ');
        console.log(`  Ejemplos: ${ejemplos}${cantidad > 3 ? '...' : ''}`);
      });
      
      // 2. Buscar parcelas del usuario 25 específicamente
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('� Paso 2: Verificando parcelas específicas del usuario 25...');
      await testEndpoint('/parcelas/usuario/25', 'GET');
      
      // 3. Probar otros userIds comunes
      const userIdsToTest = [0, 1, 2, 3, 4, 5, 10, 15, 20, 30];
      for (const userId of userIdsToTest) {
        if (parcelasPorUsuario[userId] && parcelasPorUsuario[userId].length > 0) {
          console.log(`� Encontradas parcelas en usuario ${userId}, probando endpoint...`);
          await testEndpoint(`/parcelas/usuario/${userId}`, 'GET');
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      // 4. Si encontramos un usuario con muchas parcelas, mostrar detalles
      const usuarioConMasParcelas = Object.keys(parcelasPorUsuario).reduce((a, b) => 
        parcelasPorUsuario[a].length > parcelasPorUsuario[b].length ? a : b
      );
      
      if (parcelasPorUsuario[usuarioConMasParcelas].length >= 5) {
        console.log(`🎯 USUARIO CON MÁS PARCELAS: ${usuarioConMasParcelas} (${parcelasPorUsuario[usuarioConMasParcelas].length} parcelas)`);
        console.log('� Detalles de las primeras 5 parcelas:');
        parcelasPorUsuario[usuarioConMasParcelas].slice(0, 5).forEach((parcela, index) => {
          console.log(`${index + 1}. ID:${parcela.id} - ${parcela.nombre} - Usuario:${parcela.usuarioId || parcela.userId}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Error en investigación de parcelas:', error);
      addResult('/parcelas/investigacion', 'ERROR', 'ERROR', error.message, error.message);
    }
  };

  const crearParcelasParaUsuario25 = async () => {
    setResults([]);
    
    console.log('🌱 CREANDO 10 PARCELAS PARA USUARIO 25');
    
    const parcelasACrear = [
      {
        nombre: 'Parcela Norte',
        descripcion: 'Zona con 8 horas de sol directo. Suelo bien drenado, ideal para tomates, pimientos, berenjenas y cultivos que requieren calor',
        superficie: 150.0,
        usuarioId: 25
      },
      {
        nombre: 'Parcela Sur',
        descripcion: 'Área semi-sombreada con 4-6 horas de sol. Perfecta para lechugas, espinacas, acelgas y vegetales de hoja verde',
        superficie: 120.0,
        usuarioId: 25
      },
      {
        nombre: 'Invernadero 1',
        descripcion: 'Estructura cubierta con control de temperatura y humedad. Ideal para pepinos, pimientos, cultivos tropicales y siembra temprana',
        superficie: 80.0,
        usuarioId: 25
      },
      {
        nombre: 'Parcela Este',
        descripcion: 'Recibe sol matutino suave (6 horas). Excelente para hierbas aromáticas como albahaca, perejil, cilantro y oregano',
        superficie: 100.0,
        usuarioId: 25
      },
      {
        nombre: 'Parcela Oeste',
        descripcion: 'Sol intenso de tarde (6-7 horas). Terreno amplio para maíz, calabazas, zapallos y cultivos de gran tamaño',
        superficie: 200.0,
        usuarioId: 25
      },
      {
        nombre: 'Parcela Central',
        descripcion: 'Ubicación privilegiada con acceso directo al sistema de riego. Ideal para cultivos de alto mantenimiento y valor',
        superficie: 180.0,
        usuarioId: 25
      },
      {
        nombre: 'Parcela Experimental',
        descripcion: 'Espacio para probar nuevas variedades, técnicas de cultivo innovadoras y experimentos agrícolas',
        superficie: 90.0,
        usuarioId: 25
      },
      {
        nombre: 'Huerto Orgánico',
        descripcion: 'Zona certificada libre de químicos. Solo compost natural y métodos orgánicos. Para cultivos premium y saludables',
        superficie: 160.0,
        usuarioId: 25
      },
      {
        nombre: 'Parcela de Temporada',
        descripcion: 'Área destinada a rotación de cultivos estacionales. Optimiza la fertilidad del suelo y previene plagas',
        superficie: 140.0,
        usuarioId: 25
      },
      {
        nombre: 'Vivero',
        descripcion: 'Zona protegida para germinación de semillas, crecimiento de plántulas y propagación de plantas madre',
        superficie: 60.0,
        usuarioId: 25
      }
    ];
    
    try {
      console.log('🏗️ Creando parcelas una por una...');
      
      let parcelasCreadas = 0;
      
      for (let i = 0; i < parcelasACrear.length; i++) {
        const parcela = parcelasACrear[i];
        console.log(`📦 Creando parcela ${i + 1}/10: ${parcela.nombre}`);
        
        try {
          const response = await api.post('/gestioncultivo/parcelas', parcela);
          addResult('/gestioncultivo/parcelas', 'POST', response.status, response.data);
          console.log(`✅ Parcela "${parcela.nombre}" creada con ID: ${response.data.id}`);
          parcelasCreadas++;
          
          // Pequeña pausa entre creaciones
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.error(`❌ Error creando parcela "${parcela.nombre}":`, error);
          addResult(`/parcelas/crear-${i}`, 'ERROR', 'ERROR', error.message, error.message);
        }
      }
      
      console.log(`🎉 PROCESO COMPLETADO: ${parcelasCreadas}/10 parcelas creadas`);
      
      // Verificar que se crearon correctamente
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('🔍 Verificando parcelas creadas para usuario 25...');
      await testEndpoint('/parcelas/usuario/25', 'GET');
      
    } catch (error) {
      console.error('❌ Error general en creación de parcelas:', error);
      addResult('/parcelas/crear-masivo', 'ERROR', 'ERROR', error.message, error.message);
    }
  };

  const analizarParcelasUsuario25 = async () => {
    setResults([]);
    
    console.log('🔍 ANÁLISIS DETALLADO DE PARCELAS USUARIO 25');
    
    try {
      console.log('📋 Obteniendo parcelas específicas del usuario 25...');
      const response = await api.get('/gestioncultivo/parcelas/usuario/25');
      const parcelasUsuario25 = response.data;
      
      addResult('/gestioncultivo/parcelas/usuario/25', 'GET', response.status, response.data);
      
      console.log('📊 REPORTE COMPLETO:');
      console.log('- Total parcelas del usuario 25:', parcelasUsuario25.length);
      
      if (parcelasUsuario25.length > 0) {
        console.log('\n📋 DETALLE DE CADA PARCELA:');
        parcelasUsuario25.forEach((parcela, index) => {
          console.log(`\n${index + 1}. PARCELA ID: ${parcela.id}`);
          console.log(`   Nombre: "${parcela.nombre}"`);
          console.log(`   Descripción: "${parcela.descripcion || 'SIN DESCRIPCIÓN'}"`);
          console.log(`   Superficie: ${parcela.superficie || 'No especificada'}m²`);
          console.log(`   Usuario ID: ${parcela.usuarioId || parcela.userId || 'No especificado'}`);
          console.log(`   Campos disponibles: ${Object.keys(parcela).join(', ')}`);
        });
        
        // Contar cuántas tienen descripción
        const conDescripcion = parcelasUsuario25.filter(p => p.descripcion && p.descripcion.trim() !== '').length;
        const sinDescripcion = parcelasUsuario25.length - conDescripcion;
        
        console.log('\n📈 RESUMEN:');
        console.log(`✅ Con descripción: ${conDescripcion} parcelas`);
        console.log(`❌ Sin descripción: ${sinDescripcion} parcelas`);
        
        if (sinDescripcion > 0) {
          console.log('\n⚠️ PROBLEMA IDENTIFICADO:');
          console.log('Algunas parcelas no tienen descripción. Esto puede ser porque:');
          console.log('1. Se crearon antes de implementar las descripciones detalladas');
          console.log('2. Hubo un error al guardar las descripciones en el backend');
          console.log('3. El campo descripción no se está enviando correctamente');
        }
        
        // Mostrar ejemplo de estructura completa
        console.log('\n🔬 ESTRUCTURA DE LA PRIMERA PARCELA:');
        console.log(JSON.stringify(parcelasUsuario25[0], null, 2));
        
      } else {
        console.log('❌ No se encontraron parcelas para el usuario 25');
        console.log('Esto significa que aún no se han creado parcelas para este usuario');
      }
      
    } catch (error) {
      console.error('❌ Error analizando parcelas:', error);
      addResult('/parcelas/analisis', 'ERROR', 'ERROR', error.message, error.message);
    }
  };

  const debugEstructuraDatos = async () => {
    setResults([]);
    
    console.log('🔍 ANALIZANDO ESTRUCTURA DE DATOS DEL BACKEND');
    
    try {
      const response = await api.get('/gestioncultivo/cultivos/usuario/25');
      const cultivos = response.data;
      
      addResult('/gestioncultivo/cultivos/usuario/25', 'GET', response.status, response.data);
      
      console.log('📊 ANÁLISIS COMPLETO DE ESTRUCTURA:');
      console.log('- Número de cultivos:', cultivos.length);
      
      if (cultivos.length > 0) {
        const primerCultivo = cultivos[0];
        console.log('\n🔬 PRIMER CULTIVO COMPLETO:');
        console.log(JSON.stringify(primerCultivo, null, 2));
        
        console.log('\n📋 CAMPOS DISPONIBLES:');
        Object.keys(primerCultivo).forEach(campo => {
          const valor = primerCultivo[campo];
          console.log(`- ${campo}: ${valor} (tipo: ${typeof valor})`);
        });
        
        console.log('\n✅ CAMPOS QUE ESPERAMOS:');
        console.log('- tipo:', primerCultivo.tipo || 'NO ENCONTRADO');
        console.log('- variedad:', primerCultivo.variedad || 'NO ENCONTRADO');
        console.log('- fechaSiembra:', primerCultivo.fechaSiembra || 'NO ENCONTRADO');
        console.log('- fechaCosechaEstimada:', primerCultivo.fechaCosechaEstimada || 'NO ENCONTRADO');
        console.log('- estado:', primerCultivo.estado || 'NO ENCONTRADO');
        console.log('- parcelaId:', primerCultivo.parcelaId || 'NO ENCONTRADO');
        console.log('- userId:', primerCultivo.userId || 'NO ENCONTRADO');
      }
      
    } catch (error) {
      console.error('❌ Error en análisis:', error);
      addResult('/debug/estructura', 'ERROR', 'ERROR', error.message, error.message);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        🔍 Backend Endpoint Tester
      </Typography>
      
      <Box mb={3}>
        <Button 
          variant="contained" 
          onClick={testAllEndpoints}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? 'Probando...' : 'Probar Todos los Endpoints'}
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary"
          onClick={testCultivoCreation}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          🧪 Test Crear Cultivo
        </Button>
        
        <Button 
          variant="contained" 
          color="warning"
          onClick={testInvestigacion}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          🔍 Investigación Completa
        </Button>
        
        <Button 
          variant="contained" 
          color="success"
          onClick={testValidacionFinal}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          ✅ Verificar Fix
        </Button>
        
        <Button 
          variant="contained" 
          color="error"
          onClick={testDelete}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          🗑️ Probar DELETE
        </Button>
        
        <Button 
          variant="contained" 
          color="info"
          onClick={testUpdate}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          📝 Probar UPDATE
        </Button>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={debugEstructuraDatos}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          🔍 Debug Estructura
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary"
          onClick={testParcelas}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          🏡 Investigar Parcelas
        </Button>
        
        <Button 
          variant="contained" 
          color="success"
          onClick={crearParcelasParaUsuario25}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          🌱 Crear 10 Parcelas para Usuario 25
        </Button>
        
        <Button 
          variant="contained" 
          color="info"
          onClick={analizarParcelasUsuario25}
          disabled={loading}
        >
          🔍 Analizar Parcelas Usuario 25
        </Button>
      </Box>

      <Box>
        {results.map((result, index) => (
          <Alert 
            key={index}
            severity={result.status >= 200 && result.status < 300 ? 'success' : 'error'}
            sx={{ mb: 1 }}
          >
            <Typography variant="body2">
              <strong>{result.method} {result.endpoint}</strong> - Status: {result.status}
            </Typography>
            <Typography variant="caption" component="div">
              {result.timestamp} | Data: {JSON.stringify(result.data, null, 2)}
            </Typography>
            {result.error && (
              <Typography variant="caption" color="error">
                Error: {result.error}
              </Typography>
            )}
          </Alert>
        ))}
      </Box>
    </Box>
  );
};

export default BackendTester;
