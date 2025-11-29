# Dashboard de Llamadas IA

Un dashboard moderno y premium para monitorear y analizar conversaciones de un sistema de atención al cliente basado en Inteligencia Artificial.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Características

- **Dashboard Interactivo**: Visualización en tiempo real de todas las llamadas recientes
- **Estadísticas en Tiempo Real**:
  - Total de llamadas
  - Llamadas activas
  - Métricas de interacciones
  - Promedio de conversaciones
- **Vista Detallada de Conversaciones**: Línea de tiempo completa de cada interacción usuario-IA
- **Búsqueda y Filtrado Avanzado**: Filtra llamadas por teléfono, ID o estado
- **Diseño Responsive**: Optimizado para desktop, tablet y móvil
- **Modo Oscuro**: Soporte automático para preferencias de sistema
- **Animaciones Fluidas**: Micro-interacciones y transiciones suaves
- **UI Premium**: Diseño moderno con gradientes, sombras y efectos visuales

## Tecnologías Utilizadas

- **Frontend Framework**: Angular 19 (standalone components)
- **Lenguaje**: TypeScript
- **Estilos**:
  - Tailwind CSS 4
  - CSS Custom Properties
  - CSS Grid & Flexbox
- **Gestión de Estado**: Angular Signals
- **HTTP Client**: Angular HttpClient
- **Desarrollo**: Angular CLI

## Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) (normalmente viene con Node.js)
- [Angular CLI](https://angular.io/cli) (opcional, recomendado)

```bash
npm install -g @angular/cli
```

## Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/Mik318/repotes-llamadas.git
cd repotes-llamadas
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Configura el backend** (si es necesario)

El proyecto está configurado para conectarse a una API REST. Asegúrate de que tu API esté corriendo o actualiza la configuración en los servicios correspondientes.

## Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
# o
ng serve --port 4200
```

Navega a `http://localhost:4200/` en tu navegador. La aplicación se recargará automáticamente si realizas cambios en los archivos.

### Build de Producción

```bash
npm run build
# o
ng build
```

Los archivos compilados se guardarán en el directorio `dist/`.

## Estructura del Proyecto

```
front-ia-call/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   └── home/
│   │   │       ├── home.ts          # Componente principal
│   │   │       ├── home.html        # Template
│   │   │       └── home.css         # Estilos
│   │   └── app.component.ts
│   ├── libs/
│   │   └── ia-call-api/             # API services
│   │       └── api/
│   │           └── dashboard.service.ts
│   ├── styles.css                   # Estilos globales y variables CSS
│   └── index.html
├── public/                          # Assets estáticos
├── angular.json                     # Configuración de Angular
├── package.json
├── tsconfig.json
└── README.md
```

## Características de Diseño

### Sistema de Diseño

El proyecto utiliza un sistema de diseño basado en CSS Custom Properties que incluye:

- **Paleta de Colores Premium**: Gradientes vibrantes de púrpura y cian
- **Tipografía**: Inter font family para mejor legibilidad
- **Espaciado Consistente**: Sistema de spacing tokens
- **Sombras y Elevación**: Múltiples niveles de profundidad
- **Transiciones Suaves**: Animaciones con cubic-bezier para mejor UX

### Componentes Principales

1. **Header**: Título con gradiente y botón de actualización
2. **Stats Cards**: 4 tarjetas con métricas clave
3. **Búsqueda y Filtros**: Barra de búsqueda con filtros por estado
4. **Lista de Llamadas**: Cards interactivos con información resumida
5. **Panel de Detalles**: Vista completa de conversación con timeline

## Funcionalidades

### Gestión de Estado

Utiliza Angular Signals para un manejo reactivo del estado:

```typescript
calls = signal<CallData[]>([]);
selectedCall = signal<CallData | null>(null);
filterStatus = signal<string>('all');
searchQuery = signal<string>('');
```

### Computed Values

Cálculos automáticos de estadísticas:

```typescript
stats = computed(() => ({
  total: allCalls.length,
  active: allCalls.filter((c) => c.status === 'active').length,
  withInteractions: allCalls.filter((c) => c.interaction_log.length > 0).length,
  avgInteractions: Math.round(avg * 10) / 10,
}));
```

## Responsive Design

El dashboard está totalmente optimizado para diferentes tamaños de pantalla:

- **Desktop** (> 1200px): Layout de 2 columnas con lista y detalles
- **Tablet** (768px - 1200px): Layout de 1 columna apilado
- **Mobile** (< 768px): Diseño completamente optimizado para touch

## Modo Oscuro

El proyecto incluye soporte automático para modo oscuro basado en las preferencias del sistema:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: hsl(240, 10%, 8%);
    --color-text-primary: hsl(0, 0%, 95%);
    /* ... más variables */
  }
}
```

## API Integration

El proyecto consume una API REST a través del servicio `DashboardService`:

```typescript
this.dashboardService.getCallsApiCallsGet().subscribe((res) => {
  this.calls.set(res as CallData[]);
});
```

### Estructura de Datos

```typescript
interface CallData {
  id: number;
  status: string;
  duration: number | null;
  interaction_log: InteractionLog[];
  user_phone: string;
  start_time: string;
  call_sid: string;
  user_intent: string | null;
}

interface InteractionLog {
  user: string;
  ai: string;
  timestamp: number;
}
```

## Próximas Mejoras

- [ ] Filtro por rango de fechas
- [ ] Exportación de conversaciones a PDF/CSV
- [ ] Gráficas y analytics avanzados
- [ ] Notificaciones en tiempo real con WebSockets
- [ ] Modo de búsqueda avanzada con operadores
- [ ] Temas personalizables
- [ ] Soporte multiidioma (i18n)

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Autor

**Mik318**

- GitHub: [@Mik318](https://github.com/Mik318)
- Proyecto: [repotes-llamadas](https://github.com/Mik318/repotes-llamadas)

## Agradecimientos

- Diseño inspirado en las mejores prácticas de UI/UX modernas
- Desarrollado con Angular 21 y Tailwind CSS 4
- Optimizado para proporcionar la mejor experiencia de usuario

---

Si este proyecto te fue útil, considera darle una estrella en GitHub!
