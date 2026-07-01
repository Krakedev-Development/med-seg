import { useState, useEffect, useRef, useCallback } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import InspeccionAreasMulti from '@shared/ui/InspeccionAreasMulti';
import InduccionPersonalCocina from '@entities/document/ui/templates/induccion/InduccionPersonalCocina';
import FichaMedicaEvaluacionRetiro from '@entities/document/ui/templates/fichaMedica/FichaMedicaEvaluacionRetiro';
import { documentoInspeccionSecciones } from '@shared/api/mock/documentoInspeccionData';
import Input from '@shared/ui/atoms/Input';
import Select from '@shared/ui/atoms/Select';
import FormField from '@shared/ui/molecules/FormField';
import Button from '@shared/ui/atoms/Button';
import Card, { CardContent } from '@shared/ui/organisms/Card';

// Iconos simples SVG
const PrinterIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);
const FileTextIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CrearDocumento = ({ companies, employees, establecimientos, profesionales, empresaPredefinida, empleadoPredefinido, profesionalPredefinido, tipoPredefinido, documentoExistente, plantilla }) => {
  // Mapear tipo predefinido a tipo interno
  const getTipoInterno = (tipo, plantillaId) => {
    // Si hay plantilla, usar el ID de la plantilla
    if (plantillaId) {
      // Inducciones
      if (plantillaId.startsWith('induccion-')) return 'induccion';
      // Fichas médicas
      if (plantillaId.startsWith('ficha-medica-')) return 'ficha-medica';
      // Inspecciones
      if (plantillaId.startsWith('inspeccion-')) return 'inspeccion';
      // Otros
      if (plantillaId.startsWith('informe-')) return 'otros';
    }
    
    // Si no hay plantilla, mapear por tipo
    if (!tipo) return 'inspeccion';
    const tipoMap = {
      'INSPECCIONES': 'inspeccion',
      'INDUCCIÓN': 'induccion',
      'FICHA MÉDICA': 'ficha-medica',
      'OTROS': 'otros'
    };
    return tipoMap[tipo] || 'inspeccion';
  };

  const [formData, setFormData] = useState({
    empresaId: empresaPredefinida?.id?.toString() || '',
    empleadoId: empleadoPredefinido?.id?.toString() || '',
    profesionalId: profesionalPredefinido?.id?.toString() || '',
    responsable: '',
    coordinacion: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: getTipoInterno(tipoPredefinido, plantilla?.id),
    plantillaId: plantilla?.id || '',
    // Campos adicionales para Inducción
    nombreTrabajador: empleadoPredefinido ? `${empleadoPredefinido.firstName || empleadoPredefinido.names || ''} ${empleadoPredefinido.lastName || empleadoPredefinido.lastNames || ''}`.trim() : '',
    numeroCedula: empleadoPredefinido?.cedula || empleadoPredefinido?.dni || '',
    puestoTrabajo: empleadoPredefinido?.position || '',
    actividadesPuesto: empleadoPredefinido?.actividadesPuesto || '',
    ciTecnico: '0703753681',
    registroTecnico: '7240200519',
    // Campos adicionales para Ficha Médica - Sección A
    institucion: empresaPredefinida?.name || '',
    ruc: empresaPredefinida?.ruc || '',
    ciiu: '',
    establecimientoSaludId: '',
    numeroHistoriaClinica: empleadoPredefinido ? (() => {
      const fecha = new Date();
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      const empleadoIdStr = String(empleadoPredefinido.id).padStart(3, '0').slice(-3);
      return `HC-${year}-${month}-${day}-${empleadoIdStr}`;
    })() : '',
    numeroArchivo: empleadoPredefinido ? (() => {
      const fecha = new Date();
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      const empleadoIdStr = String(empleadoPredefinido.id).padStart(3, '0').slice(-3);
      return `ARCH-${year}-${month}-${day}-${empleadoIdStr}`;
    })() : '',
    departamentoMedico: '',
    primerApellido: empleadoPredefinido?.lastNames?.split(' ')[0] || empleadoPredefinido?.lastName?.split(' ')[0] || '',
    segundoApellido: empleadoPredefinido?.lastNames?.split(' ')[1] || empleadoPredefinido?.lastName?.split(' ')[1] || '',
    primerNombre: empleadoPredefinido?.names?.split(' ')[0] || empleadoPredefinido?.firstName?.split(' ')[0] || '',
    segundoNombre: empleadoPredefinido?.names?.split(' ')[1] || empleadoPredefinido?.firstName?.split(' ')[1] || '',
    sexo: empleadoPredefinido?.sexo || '',
    fechaInicioLabores: empleadoPredefinido?.fechaInicioLabores || '',
    fechaSalida: empleadoPredefinido?.fechaSalida || new Date().toISOString().split('T')[0],
    tiempoMeses: '',
    tiempoAnios: '',

    actividades: empleadoPredefinido?.actividadesPuesto || '',
    factoresRiesgo: '',
    // Sección B - Antecedentes Personales
    antecedentesClinicosQuirurgicos: '',
    accidentesTrabajoSi: false,
    accidentesTrabajoEspecificar: '',
    accidentesTrabajoNo: false,
    accidentesTrabajoFecha: '',
    accidentesTrabajoObservaciones: '',
    accidentesTrabajoNoReportado: '',
    enfermedadesProfesionalesSi: false,
    enfermedadesProfesionalesEspecificar: '',
    enfermedadesProfesionalesNo: false,
    enfermedadesProfesionalesFecha: '',
    enfermedadesProfesionalesObservaciones: '',
    enfermedadesProfesionalesNoReportada: '',
    // Sección C - Constantes Vitales
    presionArterial: '',
    temperatura: '',
    frecuenciaCardiaca: '',
    saturacionOxigeno: '',
    frecuenciaRespiratoria: '',
    peso: '',
    talla: '',
    indiceMasaCorporal: '',
    perimetroAbdominal: '',
    // Sección D - Examen Físico
    examenFisicoObservaciones: '',
    // Sección I - Datos del Profesional
    nombresApellidosProfesional: profesionalPredefinido ? `${profesionalPredefinido.nombres} ${profesionalPredefinido.apellidos}` : '',
    codigoProfesional: profesionalPredefinido?.codigo || '',
  });

  // Estado para recomendaciones dinámicas
  const [recsPolvorin, setRecsPolvorin] = useState([""]);
  const [recsFinal, setRecsFinal] = useState([""]);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewDirty, setPreviewDirty] = useState(false);
  const previewRef = useRef(null);

  const selectedCompany = companies?.find(c => c.id === parseInt(formData.empresaId)) || null;
  const selectedEmployee = formData.empleadoId && employees
    ? employees.find(e => e.id === parseInt(formData.empleadoId))
    : null;
  const selectedProfesional = formData.profesionalId && profesionales
    ? profesionales.find(p => p.id === parseInt(formData.profesionalId))
    : null;

  const handleChange = (fieldName, value) => {
    const newFormData = {
      ...formData,
      [fieldName]: value
    };
    
    // Si se cambia el empleado y es tipo inducción, autocompletar datos
    if (fieldName === 'empleadoId' && formData.tipo === 'induccion' && employees) {
      const empleado = employees.find(e => e.id === parseInt(value));
      if (empleado) {
        const firstName = empleado.firstName || empleado.names || '';
        const lastName = empleado.lastName || empleado.lastNames || '';
        newFormData.nombreTrabajador = `${firstName} ${lastName}`.trim();
        newFormData.numeroCedula = empleado.cedula || empleado.dni || '';
        newFormData.puestoTrabajo = empleado.position || '';
        newFormData.actividadesPuesto = empleado.actividadesPuesto || '';
      } else {
        newFormData.nombreTrabajador = '';
        newFormData.numeroCedula = '';
        newFormData.puestoTrabajo = '';
        newFormData.actividadesPuesto = '';
      }
    }

    // Si se cambia el tipo a inducción y hay empleado seleccionado, autocompletar
    if (fieldName === 'tipo' && value === 'induccion' && formData.empleadoId && employees) {
      const empleado = employees.find(e => e.id === parseInt(formData.empleadoId));
      if (empleado) {
        const firstName = empleado.firstName || empleado.names || '';
        const lastName = empleado.lastName || empleado.lastNames || '';
        newFormData.nombreTrabajador = `${firstName} ${lastName}`.trim();
        newFormData.numeroCedula = empleado.cedula || empleado.dni || '';
        newFormData.puestoTrabajo = empleado.position || '';
        newFormData.actividadesPuesto = empleado.actividadesPuesto || '';
      }
    }
    
    // Si se cambia el empleado y es tipo ficha médica, autocompletar datos
    if (fieldName === 'empleadoId' && formData.tipo === 'ficha-medica' && employees) {
      const empleado = employees.find(e => e.id === parseInt(value));
      if (empleado) {
        const namesArray = (empleado.names || empleado.firstName || '').split(' ');
        const lastNamesArray = (empleado.lastNames || empleado.lastName || '').split(' ');
        newFormData.primerNombre = namesArray[0] || '';
        newFormData.segundoNombre = namesArray[1] || '';
        newFormData.primerApellido = lastNamesArray[0] || '';
        newFormData.segundoApellido = lastNamesArray[1] || '';
        newFormData.puestoTrabajo = empleado.position || '';
        
        // Generar números automáticos de historia clínica y archivo
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const empleadoIdStr = String(empleado.id).padStart(3, '0').slice(-3);
        newFormData.numeroHistoriaClinica = `HC-${year}-${month}-${day}-${empleadoIdStr}`;
        newFormData.numeroArchivo = `ARCH-${year}-${month}-${day}-${empleadoIdStr}`;
      } else {
        newFormData.primerNombre = '';
        newFormData.segundoNombre = '';
        newFormData.primerApellido = '';
        newFormData.segundoApellido = '';
        newFormData.puestoTrabajo = '';
        newFormData.numeroHistoriaClinica = '';
        newFormData.numeroArchivo = '';
      }
    }
    
    // Si se cambia el tipo a ficha médica y hay empleado seleccionado, autocompletar
    if (fieldName === 'tipo' && value === 'ficha-medica' && formData.empleadoId && employees) {
      const empleado = employees.find(e => e.id === parseInt(formData.empleadoId));
      if (empleado) {
        const namesArray = (empleado.names || empleado.firstName || '').split(' ');
        const lastNamesArray = (empleado.lastNames || empleado.lastName || '').split(' ');
        newFormData.primerNombre = namesArray[0] || '';
        newFormData.segundoNombre = namesArray[1] || '';
        newFormData.primerApellido = lastNamesArray[0] || '';
        newFormData.segundoApellido = lastNamesArray[1] || '';
        newFormData.puestoTrabajo = empleado.position || '';
        
        // Generar números automáticos de historia clínica y archivo
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const empleadoIdStr = String(empleado.id).padStart(3, '0').slice(-3);
        newFormData.numeroHistoriaClinica = `HC-${year}-${month}-${day}-${empleadoIdStr}`;
        newFormData.numeroArchivo = `ARCH-${year}-${month}-${day}-${empleadoIdStr}`;
      }
    }
    
    // Si se cambia la empresa y es tipo ficha médica, autocompletar datos de empresa
    if (fieldName === 'empresaId' && formData.tipo === 'ficha-medica' && companies) {
      const empresa = companies.find(c => c.id === parseInt(value));
      if (empresa) {
        newFormData.institucion = empresa.name || '';
        newFormData.ruc = empresa.ruc || '';
      } else {
        newFormData.institucion = '';
        newFormData.ruc = '';
      }
    }
    
    // Si se cambia el tipo a ficha médica y hay empresa seleccionada, autocompletar
    if (fieldName === 'tipo' && value === 'ficha-medica' && formData.empresaId && companies) {
      const empresa = companies.find(c => c.id === parseInt(formData.empresaId));
      if (empresa) {
        newFormData.institucion = empresa.name || '';
        newFormData.ruc = empresa.ruc || '';
      }
    }
    
    // Si se cambia el establecimiento de salud, limpiar profesional seleccionado
    if (fieldName === 'establecimientoSaludId') {
      newFormData.profesionalId = '';
      newFormData.nombresApellidosProfesional = '';
      newFormData.codigoProfesional = '';
    }
    
    // Si se cambia el profesional médico, autocompletar datos
    if (fieldName === 'profesionalId' && profesionales) {
      const profesional = profesionales.find(p => p.id === parseInt(value));
      if (profesional) {
        newFormData.nombresApellidosProfesional = `${profesional.nombres} ${profesional.apellidos}`;
        newFormData.codigoProfesional = profesional.codigo || '';
      } else {
        newFormData.nombresApellidosProfesional = '';
        newFormData.codigoProfesional = '';
      }
    }
    
    // Calcular tiempo en meses y años cuando cambian las fechas
    if ((fieldName === 'fechaInicioLabores' || fieldName === 'fechaSalida') && formData.tipo === 'ficha-medica') {
      const fechaInicio = fieldName === 'fechaInicioLabores' ? value : newFormData.fechaInicioLabores;
      const fechaSalida = fieldName === 'fechaSalida' ? value : newFormData.fechaSalida;
      
      if (fechaInicio && fechaSalida) {
        try {
          const inicio = new Date(fechaInicio);
          const salida = new Date(fechaSalida);
          
          if (salida >= inicio) {
            const diffTime = Math.abs(salida - inicio);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const meses = Math.floor(diffDays / 30.44); // Promedio de días por mes
            const anios = Math.floor(meses / 12);
            const mesesRestantes = meses % 12;
            
            newFormData.tiempoMeses = meses.toString();
            newFormData.tiempoAnios = anios > 0 ? `${anios} año${anios > 1 ? 's' : ''} ${mesesRestantes > 0 ? mesesRestantes + ' mes' + (mesesRestantes > 1 ? 'es' : '') : ''}`.trim() : `${mesesRestantes} mes${mesesRestantes !== 1 ? 'es' : ''}`;
          } else {
            newFormData.tiempoMeses = '';
            newFormData.tiempoAnios = '';
          }
        } catch (error) {
          newFormData.tiempoMeses = '';
          newFormData.tiempoAnios = '';
        }
      } else {
        newFormData.tiempoMeses = '';
        newFormData.tiempoAnios = '';
      }
    }
    
    setFormData(newFormData);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '____/____/______';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const canPreview = !!formData.tipo;

  const generatePreviewHtml = useCallback(() => {
    if (!canPreview) return '';

    try {
      const companyName = selectedCompany?.name || formData.institucion || 'Nombre de la Empresa';
      const companyLogo = selectedCompany?.logo || null;
      const inspeccionFecha = formData.fecha || '';

      if (formData.tipo === 'induccion') {
        return renderToStaticMarkup(
          <InduccionPersonalCocina
            logoEmpresa={companyLogo}
            nombreEmpresa={companyName}
            nombreTrabajador={formData.nombreTrabajador || '_________________'}
            numeroCedula={formData.numeroCedula || '_________________'}
            fecha={formData.fecha || '____/____/______'}
            puestoTrabajo={formData.puestoTrabajo || '_________________'}
            actividadesPuesto={formData.actividadesPuesto || '________________________________________________________________________________________________________________'}
            tecnicoSeguridad={formData.responsable || '_________________'}
            ciTecnico={formData.ciTecnico || '_________________'}
            registroTecnico={formData.registroTecnico || '_________________'}
            editable={false}
          />
        );
      }

      if (formData.tipo === 'ficha-medica') {
        const establecimientoNombre =
          establecimientos && formData.establecimientoSaludId
            ? establecimientos.find((e) => e.id === parseInt(formData.establecimientoSaludId, 10))?.nombre || ''
            : '';

        return renderToStaticMarkup(
          <FichaMedicaEvaluacionRetiro
            logoEmpresa={companyLogo}
            nombreEmpresa={companyName}
            institucion={formData.institucion || companyName}
            ruc={formData.ruc || selectedCompany?.ruc || ''}
            ciiu={formData.ciiu || selectedCompany?.ciiu || ''}
            establecimientoSalud={establecimientoNombre}
            numeroHistoriaClinica={formData.numeroHistoriaClinica || '_________________'}
            numeroArchivo={formData.numeroArchivo || '_________________'}
            departamentoMedico={formData.departamentoMedico || ''}
            primerApellido={formData.primerApellido || '_________________'}
            segundoApellido={formData.segundoApellido || '_________________'}
            primerNombre={formData.primerNombre || '_________________'}
            segundoNombre={formData.segundoNombre || '_________________'}
            sexo={formData.sexo || ''}
            fechaInicioLabores={formData.fechaInicioLabores || ''}
            fechaSalida={formData.fechaSalida || ''}
            tiempoMeses={formData.tiempoMeses || ''}
            tiempoAnios={formData.tiempoAnios || ''}
            puestoTrabajo={formData.puestoTrabajo || '_________________'}
            actividades={''}
            factoresRiesgo={''}
            antecedentesClinicosQuirurgicos={''}
            accidentesTrabajoSi={false}
            accidentesTrabajoEspecificar={''}
            accidentesTrabajoNo={false}
            accidentesTrabajoFecha={''}
            accidentesTrabajoObservaciones={''}
            accidentesTrabajoNoReportado={''}
            enfermedadesProfesionalesSi={false}
            enfermedadesProfesionalesEspecificar={''}
            enfermedadesProfesionalesNo={false}
            enfermedadesProfesionalesFecha={''}
            enfermedadesProfesionalesObservaciones={''}
            enfermedadesProfesionalesNoReportada={''}
            presionArterial={''}
            temperatura={''}
            frecuenciaCardiaca={''}
            saturacionOxigeno={''}
            frecuenciaRespiratoria={''}
            peso={''}
            talla={''}
            indiceMasaCorporal={''}
            perimetroAbdominal={''}
            examenFisicoObservaciones={''}
            nombresApellidosProfesional={formData.nombresApellidosProfesional || '_________________'}
            codigoProfesional={formData.codigoProfesional || '_________________'}
            editable={false}
          />
        );
      }

      return renderToStaticMarkup(
        <InspeccionAreasMulti
          logoEmpresa={companyLogo}
          nombreEmpresa={companyName}
          fechaInspeccion={formatDate(inspeccionFecha) || '____/____/______'}
          tecnicoResponsable={formData.responsable || '_________________'}
          coordinacion={formData.coordinacion || ''}
          secciones={documentoInspeccionSecciones || []}
          recsPolvorin={recsPolvorin || ['']}
          recsFinal={recsFinal || ['']}
          editable={false}
        />
      );
    } catch (error) {
      console.error('Error al generar la vista previa:', error);
      return '';
    }
  }, [
    canPreview,
    formData,
    selectedCompany,
    establecimientos,
    selectedProfesional,
    recsPolvorin,
    recsFinal,
    formatDate,
  ]);

  useEffect(() => {
    if (!canPreview) {
      setPreviewHtml('');
      setPreviewDirty(false);
      return;
    }

    if (previewDirty && previewHtml) {
      return;
    }

    const html = generatePreviewHtml();
    setPreviewHtml(html);
    setPreviewDirty(false);
  }, [canPreview, generatePreviewHtml, previewDirty, previewHtml]);

  useEffect(() => {
    if (previewRef.current && typeof previewHtml === 'string') {
      if (previewRef.current.innerHTML !== previewHtml) {
        previewRef.current.innerHTML = previewHtml;
      }
    }
  }, [previewHtml]);

  const handlePreviewInput = () => {
    if (previewRef.current) {
      setPreviewHtml(previewRef.current.innerHTML);
      setPreviewDirty(true);
    }
  };

  const handleResetPreview = () => {
    const html = generatePreviewHtml();
    setPreviewHtml(html);
    setPreviewDirty(false);
  };

  // Calcular tiempo automáticamente cuando cambian las fechas o se carga un empleado
  useEffect(() => {
    if (formData.tipo === 'ficha-medica' && formData.fechaInicioLabores && formData.fechaSalida) {
      try {
        const inicio = new Date(formData.fechaInicioLabores);
        const salida = new Date(formData.fechaSalida);
        
        if (salida >= inicio) {
          const diffTime = Math.abs(salida - inicio);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const meses = Math.floor(diffDays / 30.44);
          const anios = Math.floor(meses / 12);
          const mesesRestantes = meses % 12;
          
          setFormData(prev => ({
            ...prev,
            tiempoMeses: meses.toString(),
            tiempoAnios: anios > 0 ? `${anios} año${anios > 1 ? 's' : ''} ${mesesRestantes > 0 ? mesesRestantes + ' mes' + (mesesRestantes > 1 ? 'es' : '') : ''}`.trim() : `${mesesRestantes} mes${mesesRestantes !== 1 ? 'es' : ''}`
          }));
        }
      } catch (error) {
        console.error('Error al calcular tiempo:', error);
      }
    }
  }, [formData.fechaInicioLabores, formData.fechaSalida, formData.tipo]);

  // Funciones para manejar recomendaciones
  const handleAddRecPolvorin = () => setRecsPolvorin([...recsPolvorin, ""]);
  const handleRemoveRecPolvorin = (i) => setRecsPolvorin(recsPolvorin.filter((_, idx) => idx !== i));
  const handleUpdateRecPolvorin = (i, val) => {
    const copy = [...recsPolvorin];
    copy[i] = val;
    setRecsPolvorin(copy);
  };

  const handleAddRecFinal = () => setRecsFinal([...recsFinal, ""]);
  const handleRemoveRecFinal = (i) => setRecsFinal(recsFinal.filter((_, idx) => idx !== i));
  const handleUpdateRecFinal = (i, val) => {
    const copy = [...recsFinal];
    copy[i] = val;
    setRecsFinal(copy);
  };

  const handlePrint = async () => {
    // Validaciones según tipo de documento
    if (formData.tipo === 'induccion') {
      if (!selectedCompany || !formData.responsable || !formData.nombreTrabajador || !formData.numeroCedula || !formData.puestoTrabajo) {
        alert('Por favor complete los campos obligatorios (Empresa, Técnico Responsable, Nombre del Trabajador, Cédula y Puesto)');
        return;
      }
    } else if (formData.tipo === 'ficha-medica') {
      if (!selectedCompany || !selectedProfesional || !formData.primerNombre || !formData.primerApellido) {
        alert('Por favor complete los campos obligatorios (Empresa, Profesional Médico, Primer Nombre y Primer Apellido)');
        return;
      }
    } else {
      if (!selectedCompany || !formData.responsable) {
        alert('Por favor complete los campos obligatorios (Empresa y Técnico Responsable)');
        return;
      }
    }

    const previewNode = previewRef.current;
    const currentHtml =
      previewNode && previewNode.innerHTML.trim().length > 0
        ? previewNode.innerHTML
        : generatePreviewHtml();

    if (!currentHtml) {
      alert('No hay contenido para imprimir. Genera la vista previa primero.');
      return;
    }

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = currentHtml;

    const documentId =
      formData.tipo === 'induccion'
        ? 'documento-induccion'
        : formData.tipo === 'ficha-medica'
        ? 'documento-ficha-medica'
        : 'documento-inspeccion';

    // Crear una nueva ventana para imprimir solo el documento
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      alert('Por favor permite ventanas emergentes para imprimir');
      return;
    }

    // Convertir imágenes y SVGs a base64 para que se muestren al imprimir
    const convertImagesToBase64 = async (docElement) => {
      const images = docElement.querySelectorAll('img');
      const svgs = docElement.querySelectorAll('svg');
      
      // Convertir imágenes
      const imagePromises = Array.from(images).map(async (img) => {
        const src = img.getAttribute('src');
        if (!src) return;
        
        try {
          // Si ya es base64, no hacer nada
          if (src.startsWith('data:image')) return;
          
          // Si es una URL local (blob), convertirla
          if (src.startsWith('blob:')) {
            const response = await fetch(src);
            const blob = await response.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                img.setAttribute('src', reader.result);
                resolve();
              };
              reader.onerror = () => resolve(); // Continuar aunque falle
              reader.readAsDataURL(blob);
            });
          }
          
          // Si es una URL relativa, intentar cargarla
          if (src.startsWith('/') || src.startsWith('./')) {
            const response = await fetch(src);
            const blob = await response.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                img.setAttribute('src', reader.result);
                resolve();
              };
              reader.onerror = () => resolve(); // Continuar aunque falle
              reader.readAsDataURL(blob);
            });
          }
        } catch (error) {
          console.error('Error convirtiendo imagen:', error);
        }
      });
      
      // Convertir SVGs a imágenes base64
      const svgPromises = Array.from(svgs).map(async (svg) => {
        try {
          // Serializar el SVG
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svg);
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              // Reemplazar el SVG con una imagen
              const img = document.createElement('img');
              img.src = reader.result;
              img.style.width = svg.getAttribute('width') || svg.style.width || '80px';
              img.style.height = svg.getAttribute('height') || svg.style.height || '80px';
              img.style.objectFit = 'contain';
              img.style.border = '1px solid #ccc';
              svg.parentNode.replaceChild(img, svg);
              resolve();
            };
            reader.onerror = () => resolve(); // Continuar aunque falle
            reader.readAsDataURL(svgBlob);
          });
        } catch (error) {
          console.error('Error convirtiendo SVG:', error);
        }
      });
      
      await Promise.all([...imagePromises, ...svgPromises]);
    };

    // Clonar el elemento y convertir sus imágenes
    const clonedContainer = tempContainer.cloneNode(true);
    await convertImagesToBase64(clonedContainer);
    
    // Obtener el HTML del elemento clonado con imágenes convertidas
    const htmlContent = clonedContainer.innerHTML;

    // Escribir el contenido en la nueva ventana con estilos optimizados
    const htmlToWrite = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Documento de Inspección</title>
          <style>
            @page {
              margin: 5mm !important;
              size: A4 portrait;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: auto;
              font-family: Arial, sans-serif;
              background: white;
              color: #000;
            }
            #documento-inspeccion,
            #documento-induccion,
            #documento-ficha-medica {
              width: 100%;
              max-width: 100%;
              margin: 0 auto;
              padding: 5mm;
              background: white;
              font-size: 12pt;
              line-height: 1.4;
            }
            #documento-inspeccion table,
            #documento-induccion table,
            #documento-ficha-medica table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11pt;
              margin: 0;
            }
            #documento-induccion {
              font-family: Arial, sans-serif;
              font-size: 11px;
            }
            #documento-induccion th,
            #documento-induccion td {
              border: 1px solid #000;
              padding: 8px;
              font-size: 10px;
              vertical-align: top;
              white-space: normal;
              word-wrap: break-word;
            }
            #documento-induccion img {
              max-width: 100%;
              height: auto;
              display: block !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            #documento-inspeccion th,
            #documento-inspeccion td {
              border: 1px solid #000;
              padding: 4px;
              font-size: 11pt;
              vertical-align: middle;
            }
            #documento-inspeccion thead th {
              background-color: #A9D18E !important;
              color: #000 !important;
              font-weight: bold;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            /* Eliminar bordes de inputs y textareas en impresión */
            #documento-inspeccion input[type="text"] {
              border: none !important;
              border-width: 0 !important;
              outline: none !important;
              background: transparent !important;
              box-shadow: none !important;
              appearance: none !important;
              -webkit-appearance: none !important;
              width: 100%;
              padding: 2px !important;
              margin: 0;
              font-size: 11pt;
            }
            /* Asegurar que las celdas con inputs no muestren bordes dobles */
            #documento-inspeccion td input[type="text"] {
              padding: 2px !important;
            }
            #documento-inspeccion input[type="checkbox"] {
              border: 1px solid #000 !important;
              outline: none !important;
              background: transparent !important;
              box-shadow: none !important;
              appearance: none !important;
              -webkit-appearance: none !important;
            }
            #documento-inspeccion textarea {
              border: none !important;
              outline: none !important;
              background: transparent !important;
              box-shadow: none !important;
            }
            /* Checkboxes que muestren X cuando están marcados */
            #documento-inspeccion input[type="checkbox"]:checked::after {
              content: "X";
              position: absolute;
              font-size: 10pt;
              font-weight: bold;
              color: #000;
            }
            #documento-inspeccion input[type="checkbox"] {
              width: 12px;
              height: 12px;
              border: 1px solid #000;
              position: relative;
              display: inline-block;
            }
            /* Encabezado con estilos fijos idénticos a la previsualización */
            #documento-inspeccion header {
              border: 1px solid #000;
              margin-bottom: 10mm;
              page-break-inside: avoid;
            }
            #documento-inspeccion header > div {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #000;
              padding: 8px;
            }
            #documento-inspeccion header img {
              width: 80px;
              height: 80px;
              object-fit: contain;
              border: 1px solid #ccc;
              flex-shrink: 0;
              display: block !important;
              visibility: visible !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            /* Asegurar que las imágenes se impriman */
            img {
              max-width: 100%;
              height: auto;
              display: block !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            #documento-inspeccion header h1 {
              text-align: center;
              font-size: 20pt;
              font-weight: bold;
              text-transform: uppercase;
              margin: 0;
              padding: 0;
              flex: 1;
            }
            #documento-inspeccion header h1 span {
              font-size: 16pt;
              font-weight: 600;
              display: block;
              margin-top: 4px;
            }
            #documento-inspeccion header table {
              width: 100%;
              border-collapse: collapse;
              border-top: 1px solid #000;
              font-size: 11pt;
            }
            #documento-inspeccion header table tr {
              border-top: 1px solid #000;
            }
            #documento-inspeccion header table td {
              border: 1px solid #000;
              padding: 8px;
              font-size: 11pt;
              vertical-align: middle;
            }
            #documento-inspeccion header table td:first-child {
              border-right: 1px solid #000;
              width: 50%;
            }
            #documento-inspeccion section {
              page-break-inside: avoid;
              margin-bottom: 10mm;
            }
            #documento-inspeccion section:last-child {
              page-break-after: avoid;
            }
            /* Ocultar placeholders al imprimir */
            @media print {
              #documento-inspeccion textarea::placeholder,
              #documento-inspeccion input::placeholder {
                color: transparent !important;
                opacity: 0 !important;
              }
              /* Asegurar que los textareas de recomendaciones se muestren completos */
              #documento-inspeccion textarea {
                overflow: visible !important;
                height: auto !important;
                min-height: auto !important;
                white-space: pre-wrap !important;
                word-wrap: break-word !important;
              }
            }
            /* Ajustar columna RECOMENDACIÓN en la tabla */
            #documento-inspeccion th.recomendacion {
              width: 20% !important;
              font-size: 10pt !important;
            }
            /* Asegurar que las recomendaciones no se corten */
            #documento-inspeccion textarea[readonly] {
              overflow: visible !important;
              height: auto !important;
              white-space: pre-wrap !important;
              word-wrap: break-word !important;
              overflow-wrap: break-word !important;
              max-height: none !important;
            }
            /* Contenedores de recomendaciones */
            #documento-inspeccion div.flex.items-start.mb-2 {
              overflow: visible !important;
              page-break-inside: avoid !important;
            }
            #documento-inspeccion .mt-4.border.border-black,
            #documento-inspeccion .mt-6.border.border-black {
              overflow: visible !important;
              page-break-inside: avoid !important;
            }
            /* Asegurar que las secciones de recomendaciones no se corten */
            #documento-inspeccion > section > div:last-child {
              page-break-inside: avoid !important;
              overflow: visible !important;
            }
            #documento-inspeccion > section > div:last-child > div {
              overflow: visible !important;
            }
            @media print {
              html, body {
                margin: 0;
                padding: 0;
              }
              @page {
                margin: 5mm !important;
              }
              #documento-inspeccion,
              #documento-induccion,
              #documento-ficha-medica {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div id="${documentId}">
            ${htmlContent}
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlToWrite);
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

  const requiereRecomendaciones = formData.tipo === 'inspeccion';
  const esInduccion = formData.tipo === 'induccion';
  const esFichaMedica = formData.tipo === 'ficha-medica';
  const [datosDocumentoAbierto, setDatosDocumentoAbierto] = useState(true);
  const [datosEstablecimientoAbierto, setDatosEstablecimientoAbierto] = useState(false);
  const [datosUsuarioAbierto, setDatosUsuarioAbierto] = useState(false);

  // Filtrar profesionales por establecimiento seleccionado
  const profesionalesFiltrados = formData.establecimientoSaludId && profesionales
    ? profesionales.filter(prof => prof.establecimientoSaludId === parseInt(formData.establecimientoSaludId))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Crear Documento Dinámico</h1>
        <p className="text-gray-600 mt-1">Generar documentos de Inspección, Inducción o Informe Psicosocial</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda: Formulario */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header del Acordeón */}
            <button
              onClick={() => setDatosDocumentoAbierto(!datosDocumentoAbierto)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-800">Datos del Documento</h2>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${datosDocumentoAbierto ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Contenido del Acordeón */}
            {datosDocumentoAbierto && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-200 pt-4">
                <FormField label="Empresa" required>
                  <Select
                    value={formData.empresaId}
                    onChange={(e) => handleChange('empresaId', e.target.value)}
                    required
                  >
                    <option value="">Seleccione una empresa</option>
                    {companies && companies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </Select>
                  {selectedCompany && selectedCompany.logo && (
                    <div className="mt-2">
                      <img
                        src={selectedCompany.logo}
                        alt={`Logo ${selectedCompany.name}`}
                        className="w-24 h-24 object-contain border border-gray-300 rounded"
                      />
                    </div>
                  )}
                </FormField>

                <FormField label="Empleado (opcional)">
                  <Select
                    value={formData.empleadoId}
                    onChange={(e) => handleChange('empleadoId', e.target.value)}
                    disabled={!formData.empresaId}
                  >
                    <option value="">Seleccione un empleado (opcional)</option>
                    {employees && employees
                      .filter(emp => emp.companyId === parseInt(formData.empresaId))
                      .map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.names || employee.firstName || ''} {employee.lastNames || employee.lastName || ''} - {employee.position || ''}
                        </option>
                      ))}
                  </Select>
                </FormField>


                {/* Técnico Responsable - Solo si NO es Ficha Médica */}
                {!esFichaMedica && (
                  <>
                    <FormField label="Técnico Responsable / Encargado" required>
                      <Input
                        type="text"
                        value={formData.responsable}
                        onChange={(e) => handleChange('responsable', e.target.value)}
                        placeholder="Ej: Ing. Roque Maldonado Ramírez"
                        required
                      />
                    </FormField>

                    <FormField label="En Coordinación Con (opcional)">
                      <Input
                        type="text"
                        value={formData.coordinacion}
                        onChange={(e) => handleChange('coordinacion', e.target.value)}
                        placeholder="Ej: Ing. Daniel Maldonado, Sr. Wilmer Arnaldo Cárdenas López"
                      />
                    </FormField>
                  </>
                )}

                <FormField label="Fecha">
                  <Input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => handleChange('fecha', e.target.value)}
                  />
                </FormField>

                <FormField label="Tipo de Documento">
                  <Select
                    value={formData.tipo}
                    onChange={(e) => handleChange('tipo', e.target.value)}
                  >
                    <option value="inspeccion">Inspección de Áreas</option>
                    <option value="induccion">Inducción Personal de Cocina</option>
                    <option value="ficha-medica">Ficha Médica - Evaluación de Retiro</option>
                    {/* Futuros tipos: Informe Psicosocial */}
                  </Select>
                </FormField>
              </div>
            )}
          </div>

          {/* Acordeón: Datos del Establecimiento - Solo para Ficha Médica */}
          {esFichaMedica && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setDatosEstablecimientoAbierto(!datosEstablecimientoAbierto)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-800">Datos del Establecimiento</h2>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${datosEstablecimientoAbierto ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {datosEstablecimientoAbierto && (
                <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Establecimiento de Salud *
                    </label>
                    <select
                      value={formData.establecimientoSaludId}
                      onChange={(e) => handleChange('establecimientoSaludId', e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Seleccione un establecimiento</option>
                      {establecimientos && establecimientos.map(est => (
                        <option key={est.id} value={est.id}>
                          {est.nombre} - {est.codigo}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profesional Médico * <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.profesionalId}
                      onChange={(e) => handleChange('profesionalId', e.target.value)}
                      required
                      disabled={!formData.establecimientoSaludId}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        !formData.establecimientoSaludId ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value="">
                        {formData.establecimientoSaludId 
                          ? 'Seleccione un profesional médico' 
                          : 'Primero seleccione un establecimiento'}
                      </option>
                      {profesionalesFiltrados.map(prof => (
                        <option key={prof.id} value={prof.id}>
                          {prof.nombres} {prof.apellidos} - {prof.codigo}
                        </option>
                      ))}
                    </select>
                    {selectedProfesional && (
                      <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{selectedProfesional.nombres} {selectedProfesional.apellidos}</p>
                        <p className="text-xs text-gray-600">Código: {selectedProfesional.codigo}</p>
                        {selectedProfesional.especialidad && (
                          <p className="text-xs text-gray-600">Especialidad: {selectedProfesional.especialidad}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Historia Clínica
                      </label>
                      <input
                        type="text"
                        value={formData.numeroHistoriaClinica}
                        onChange={(e) => handleChange('numeroHistoriaClinica', e.target.value)}
                        placeholder="Nº Historia Clínica"
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-primary focus:border-transparent"
                        title="Generado automáticamente"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Archivo
                      </label>
                      <input
                        type="text"
                        value={formData.numeroArchivo}
                        onChange={(e) => handleChange('numeroArchivo', e.target.value)}
                        placeholder="Nº Archivo"
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:ring-2 focus:ring-primary focus:border-transparent"
                        title="Generado automáticamente"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento Médico
                    </label>
                    <input
                      type="text"
                      value={formData.departamentoMedico}
                      onChange={(e) => handleChange('departamentoMedico', e.target.value)}
                      placeholder="Departamento médico"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Acordeón: Datos del Usuario y Empresa - Solo para Ficha Médica */}
          {esFichaMedica && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setDatosUsuarioAbierto(!datosUsuarioAbierto)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-800">Datos del Usuario y Empresa</h2>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${datosUsuarioAbierto ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {datosUsuarioAbierto && (
                <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
                  <h3 className="text-md font-semibold text-gray-800 mb-2">Datos de la Empresa</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institución o Nombre de la Empresa
                    </label>
                    <input
                      type="text"
                      value={formData.institucion}
                      onChange={(e) => handleChange('institucion', e.target.value)}
                      placeholder="Nombre de la institución"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        RUC
                      </label>
                      <input
                        type="text"
                        value={formData.ruc}
                        onChange={(e) => handleChange('ruc', e.target.value)}
                        placeholder="RUC"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CIIU
                      </label>
                      <input
                        type="text"
                        value={formData.ciiu}
                        onChange={(e) => handleChange('ciiu', e.target.value)}
                        placeholder="CIIU"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primer Apellido
                      </label>
                      <input
                        type="text"
                        value={formData.primerApellido}
                        onChange={(e) => handleChange('primerApellido', e.target.value)}
                        placeholder="Primer apellido"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Segundo Apellido
                      </label>
                      <input
                        type="text"
                        value={formData.segundoApellido}
                        onChange={(e) => handleChange('segundoApellido', e.target.value)}
                        placeholder="Segundo apellido"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primer Nombre
                      </label>
                      <input
                        type="text"
                        value={formData.primerNombre}
                        onChange={(e) => handleChange('primerNombre', e.target.value)}
                        placeholder="Primer nombre"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Segundo Nombre
                      </label>
                      <input
                        type="text"
                        value={formData.segundoNombre}
                        onChange={(e) => handleChange('segundoNombre', e.target.value)}
                        placeholder="Segundo nombre"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sexo
                      </label>
                      <select
                        value={formData.sexo}
                        onChange={(e) => handleChange('sexo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Seleccione</option>
                        <option value="H">H</option>
                        <option value="M">M</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puesto de Trabajo (CIUO)
                      </label>
                      <input
                        type="text"
                        value={formData.puestoTrabajo}
                        onChange={(e) => handleChange('puestoTrabajo', e.target.value)}
                        placeholder="Puesto de trabajo"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Inicio de Labores
                      </label>
                      <input
                        type="date"
                        value={formData.fechaInicioLabores}
                        onChange={(e) => handleChange('fechaInicioLabores', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Salida
                      </label>
                      <input
                        type="date"
                        value={formData.fechaSalida}
                        onChange={(e) => handleChange('fechaSalida', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiempo (Meses)
                      </label>
                      <input
                        type="number"
                        value={formData.tiempoMeses}
                        readOnly
                        placeholder="Se calculará automáticamente"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Campos adicionales para Inducción */}
          {esInduccion && (
            <Card className="p-6">
              <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-800 mb-2">Datos del Trabajador</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Trabajador *
                    </label>
                    <input
                      type="text"
                      value={formData.nombreTrabajador}
                      onChange={(e) => handleChange('nombreTrabajador', e.target.value)}
                      placeholder="Nombre completo del trabajador"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nº de Cédula *
                    </label>
                    <input
                      type="text"
                      value={formData.numeroCedula}
                      onChange={(e) => handleChange('numeroCedula', e.target.value)}
                      placeholder="Número de cédula"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Puesto de Trabajo *
                    </label>
                    <input
                      type="text"
                      value={formData.puestoTrabajo}
                      onChange={(e) => handleChange('puestoTrabajo', e.target.value)}
                      placeholder="Ej: Personal de Cocina"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actividades del Puesto
                    </label>
                    <textarea
                      value={formData.actividadesPuesto}
                      onChange={(e) => handleChange('actividadesPuesto', e.target.value)}
                      placeholder="Descripción de las actividades principales del puesto..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
              </div>
            </Card>
          )}

          {/* Sección de recomendaciones dinámicas - Solo para Inspección */}
          {requiereRecomendaciones && (
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-md font-semibold text-gray-800 mb-2">Recomendaciones (Polvorín)</h3>
                  {recsPolvorin.map((rec, ri) => (
                    <div key={ri} className="flex items-start gap-2">
                      <span className="w-6 font-semibold text-sm">{ri + 1}.</span>
                      <textarea
                        value={rec}
                        onChange={(e) => handleUpdateRecPolvorin(ri, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ingrese la recomendación..."
                        rows={2}
                      ></textarea>
                      {recsPolvorin.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          type="button"
                          onClick={() => handleRemoveRecPolvorin(ri)}
                          className="px-2 py-1 text-xs"
                        >
                          –
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    onClick={handleAddRecPolvorin}
                  >
                    + Agregar Recomendación (Polvorín)
                  </Button>

                  <h3 className="text-md font-semibold text-gray-800 mb-2 mt-6">Recomendaciones Generales</h3>
                  {recsFinal.map((rec, ri) => (
                    <div key={ri} className="flex items-start gap-2">
                      <span className="w-6 font-semibold text-sm">{ri + 1}.</span>
                      <textarea
                        value={rec}
                        onChange={(e) => handleUpdateRecFinal(ri, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ingrese la recomendación general..."
                        rows={2}
                      ></textarea>
                      {recsFinal.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          type="button"
                          onClick={() => handleRemoveRecFinal(ri)}
                          className="px-2 py-1 text-xs"
                        >
                          –
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    onClick={handleAddRecFinal}
                  >
                    + Agregar Recomendación General
                  </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Columna derecha: Vista previa */}
        <div className="space-y-4">
          <Card className="p-4 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Vista Previa del Documento</h3>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={handleResetPreview}
                disabled={!previewDirty}
              >
                Restablecer
              </Button>
            </div>

            {canPreview ? (
              <div className="space-y-4">
                <div
                  ref={previewRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto max-h-[calc(100vh-300px)] prose prose-sm max-w-none"
                  onInput={handlePreviewInput}
                  style={{ cursor: 'text', minHeight: '400px' }}
                />

                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="primary"
                    onClick={handlePrint}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <PrinterIcon className="w-5 h-5" />
                    Imprimir Documento
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Haz clic sobre cualquier texto para editarlo. Los cambios se guardan en esta vista previa y se reflejan al imprimir o exportar.
                </p>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-lg p-8 bg-gray-50 text-center text-gray-500">
                <FileTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>
                  {esInduccion
                    ? 'Seleccione una empresa, técnico responsable y complete los datos del trabajador para ver la vista previa'
                    : esFichaMedica
                    ? 'Seleccione una empresa, profesional médico y complete los datos del usuario para ver la vista previa'
                    : 'Seleccione una empresa y complete los datos para ver la vista previa del documento'}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CrearDocumento;
