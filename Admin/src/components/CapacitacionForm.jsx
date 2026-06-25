import { useState, useEffect } from 'react';
import { filtrarPlantillasPorActividad } from '../data/plantillasCapacitacion';

const CapacitacionForm = ({ onAddCapacitacion, onUpdateCapacitacion, editingCapacitacion, onCancel, companies, actividadesDisponibles, estadosCapacitacion, empresaId, employees = [] }) => {
  const [formData, setFormData] = useState({
    nombre: editingCapacitacion?.nombre || '',
    descripcion: editingCapacitacion?.descripcion || '',
    fechaProgramada: editingCapacitacion?.fechaProgramada || new Date().toISOString().split('T')[0],
    actividadRelacionada: editingCapacitacion?.actividadRelacionada || 'Minería',
    estado: editingCapacitacion?.estado || 'Programada',
    empresasAsignadas: editingCapacitacion?.empresasAsignadas || [],
    generarRegistroFirmas: false,
    plantillaId: editingCapacitacion?.plantillaId || '',
    capacitadores: editingCapacitacion?.capacitadores || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEmpresasChange = (empresaId) => {
    const empresaIdNum = parseInt(empresaId, 10);
    setFormData(prev => {
      const empresas = prev.empresasAsignadas || [];
      if (empresas.includes(empresaIdNum)) {
        return {
          ...prev,
          empresasAsignadas: empresas.filter(id => id !== empresaIdNum)
        };
      } else {
        return {
          ...prev,
          empresasAsignadas: [...empresas, empresaIdNum]
        };
      }
    });
  };

  const generarPDFRegistroFirmas = (capacitacion, empleados) => {
    const empresaNombre = companies?.find(c => c.id === empresaId)?.name || 'Empresa';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Registro de Firmas - ${capacitacion.nombre}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            .header h1 {
              margin: 0 0 10px 0;
              font-size: 18px;
              color: #2c5282;
            }
            .header h2 {
              margin: 5px 0;
              font-size: 14px;
              color: #333;
            }
            .info-section {
              margin-bottom: 25px;
              background-color: #f7fafc;
              padding: 15px;
              border-radius: 5px;
            }
            .info-row {
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              color: #2d3748;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #333;
              padding: 10px 8px;
              text-align: left;
            }
            th {
              background-color: #2c5282;
              color: white;
              font-weight: bold;
              font-size: 11px;
            }
            td {
              height: 40px;
              vertical-align: middle;
            }
            .col-numero { width: 8%; text-align: center; }
            .col-nombre { width: 30%; }
            .col-dni { width: 15%; text-align: center; }
            .col-firma { width: 25%; }
            .col-fecha { width: 22%; text-align: center; }
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #ccc;
              font-size: 10px;
              color: #666;
              text-align: center;
            }
            .firma-space {
              min-height: 35px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>REGISTRO DE FIRMAS DE CAPACITACIÓN</h1>
            <h2>${empresaNombre}</h2>
          </div>

          <div class="info-section">
            <div class="info-row">
              <span class="info-label">Capacitación:</span> ${capacitacion.nombre}
            </div>
            <div class="info-row">
              <span class="info-label">Descripción:</span> ${capacitacion.descripcion || 'N/A'}
            </div>
            <div class="info-row">
              <span class="info-label">Fecha Programada:</span> ${new Date(capacitacion.fechaProgramada).toLocaleDateString('es-ES')}
            </div>
            <div class="info-row">
              <span class="info-label">Actividad:</span> ${capacitacion.actividadRelacionada}
            </div>
            <div class="info-row">
              <span class="info-label">Total de Participantes:</span> ${empleados.length}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th class="col-numero">N°</th>
                <th class="col-nombre">Nombre Completo</th>
                <th class="col-dni">DNI/Cédula</th>
                <th class="col-firma">Firma</th>
                <th class="col-fecha">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              ${empleados.map((empleado, index) => `
                <tr>
                  <td class="col-numero">${index + 1}</td>
                  <td class="col-nombre">${empleado.names} ${empleado.lastNames}</td>
                  <td class="col-dni">${empleado.dni || empleado.cedula || 'N/A'}</td>
                  <td class="col-firma">
                    <div class="firma-space"></div>
                  </td>
                  <td class="col-fecha"></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Documento generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
            <p>Este documento es una constancia de la capacitación realizada y debe ser firmado por todos los participantes.</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    const triggerPrint = () => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 500);
    };

    if (printWindow.document.readyState === 'complete') {
      triggerPrint();
    } else {
      printWindow.onload = triggerPrint;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre && formData.fechaProgramada && formData.actividadRelacionada) {
      if (editingCapacitacion) {
        onUpdateCapacitacion({
          ...editingCapacitacion,
          ...formData,
          fechaCreacion: editingCapacitacion.fechaCreacion
        });
      } else {
        const newCapacitacion = {
          id: Date.now(),
          empresaId: empresaId || null,
          ...formData,
          fechaCreacion: new Date().toISOString().split('T')[0]
        };
        onAddCapacitacion(newCapacitacion);
        
        // Generar PDF de registro de firmas si está marcado
        if (formData.generarRegistroFirmas && empresaId) {
          const empleadosEmpresa = employees.filter(emp => emp.companyId === empresaId);
          if (empleadosEmpresa.length > 0) {
            setTimeout(() => {
              generarPDFRegistroFirmas(newCapacitacion, empleadosEmpresa);
            }, 300);
          } else {
            alert('No hay empleados registrados para esta empresa');
          }
        }
        
        setFormData({
          nombre: '',
          descripcion: '',
          fechaProgramada: '',
          actividadRelacionada: 'Minería',
          estado: 'Programada',
          empresasAsignadas: [],
          generarRegistroFirmas: false,
        });
      }
    }
  };

  // Filtrar empresas según actividad seleccionada
  const empresasFiltradas = companies?.filter(emp => 
    emp.tipoActividad === formData.actividadRelacionada
  ) || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {editingCapacitacion ? 'Editar Capacitación' : 'Nueva Capacitación'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Capacitación *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: Seguridad en Minería Subterránea"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacitador(es)
            </label>
            <input
              type="text"
              name="capacitadores"
              value={formData.capacitadores}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ej: Dr. Carlos Ramírez, Ing. María López"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Descripción detallada de la capacitación..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Programada *
            </label>
            <input
              type="date"
              name="fechaProgramada"
              value={formData.fechaProgramada}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actividad Relacionada *
            </label>
            <select
              name="actividadRelacionada"
              value={formData.actividadRelacionada}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {actividadesDisponibles.map(actividad => (
                <option key={actividad} value={actividad}>{actividad}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado *
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {estadosCapacitacion.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plantilla de documento
            </label>
            <select
              name="plantillaId"
              value={formData.plantillaId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Seleccione una plantilla</option>
              {filtrarPlantillasPorActividad().map(pl => (
                <option key={pl.id} value={pl.id}>
                  {pl.icono} {pl.nombre} ({pl.categoria})
                </option>
              ))}
            </select>
          </div>
        </div>

        {!editingCapacitacion && empresaId && (
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.generarRegistroFirmas}
                onChange={(e) => setFormData({ ...formData, generarRegistroFirmas: e.target.checked })}
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">Generar Registro de Firmas</span>
                <p className="text-xs text-gray-500 mt-1">
                  Se generará un PDF con la lista de empleados para recoger firmas de asistencia
                </p>
              </div>
            </label>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            {editingCapacitacion ? 'Actualizar Capacitación' : 'Crear Capacitación'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CapacitacionForm;

