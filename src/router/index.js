import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        // USER
        {
            path: '/signin',
            name: 'Sign In',
            component: () => import('@/views/User/SignIn'),
            meta: { showFooter: true },
        },
        {
            path: '/signup',
            name: 'Sign Up',
            component: () => import('@/views/User/SignUp'),
        },
        {
            path: '/profile',
            name: 'User Profile',
            component: () => import('@/views/User/Profile'),
            beforeEnter: AuthGuard,
        },
        // MAPVIEWER
        {
            path: '/',
            name: 'Map Viewer',
            component: () => import('@/views/MapViewer.vue'),
            meta: { leftPanelSection: 'mapviewer' },
            beforeEnter: AuthGuard,
        },
        // LANDING PAGE
        {
            path: '/about',
            name: 'About',
            component: () => import('@/views/About'),
            meta: { showFooter: true },
        },
        {
            path: '/contact',
            name: 'Contact',
            component: () => import('@/views/Contact'),
            meta: { showFooter: true },
        },
        {
            path: '/support',
            name: 'Support',
            component: () => import('@/views/Support'),
            meta: { showFooter: true },
        },
        {
            path: '/admin',
            name: 'Admin',
            component: () => import('@/views/Admin'),
            meta: { showFooter: true },
        },
        // COP
        {
            path: '/createemergency',
            name: 'Create Emergency',
            component: () => import('@/views/COP/CreateEmergency'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        // ELS: EMERGENCY STATUS BOARD
        {
            path: '/statusboard/emergencylist',
            name: 'List of Emergencies',
            component: () => import('@/views/ELS/ListOfEmergency'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/incidentfacts/:id',
            name: 'Incident Facts',
            component: () => import('@/views/ELS/IncidentFacts'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/map/:id',
            name: 'Map',
            component: () => import('@/views/ELS/Map'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS', showRightPanel: true },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/incidentfactsupdate/:id',
            name: 'Incident Facts Update',
            component: () => import('@/views/COP/IncidentFactsUpdate'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/organizationchart/:id',
            name: 'Organization Chart',
            component: () => import('@/views/ELS/OrganizationChart'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/headcountmanagement/:id',
            name: 'Headcount Management',
            component: () => import('@/views/ELS/HeadcountManagement'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/eventlog/:id',
            name: 'Event Log',
            component: () => import('@/views/ELS/EventLog'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/integrationlog/:id',
            name: 'Integration Log',
            component: () => import('@/views/ELS/IntegrationLog'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/unitlog/:id',
            name: 'Unit Log',
            component: () => import('@/views/ELS/UnitLog'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/casualties/:id',
            name: 'Casualties',
            component: () => import('@/views/ELS/Casualties'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/resources/:id',
            name: 'Resources',
            component: () => import('@/views/ELS/Resources'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/incidentactionplan/:id',
            name: 'Incident Action Plan',
            component: () => import('@/views/ELS/IncidentActionPlan'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/statusboard/notificationalert/:id',
            name: 'Notification Alert',
            component: () => import('@/views/ELS/NotificationAlert'),
            meta: { showEmergencyStatusBoardHeader: true, leftPanelSection: 'ELS' },
            beforeEnter: AuthGuard,
        },
        // DIGITAL TOOLS
        {
            path: '/digitaltools/foamcalculator',
            name: 'Foam Calculator',
            component: () => import('@/views/DigitalTools/FoamCalculator'),
            meta: { leftPanelSection: 'digitaltools' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/digitaltools/scat',
            name: 'SCAT',
            component: () => import('@/views/DigitalTools/SCAT'),
            meta: { leftPanelSection: 'digitaltools' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/digitaltools/sima',
            name: 'SIMA',
            component: () => import('@/views/DigitalTools/SIMA'),
            meta: { leftPanelSection: 'digitaltools' },
            beforeEnter: AuthGuard,
        },
        // DIGITAL LIBRARY
        {
            path: '/digitallibrary/trainingmodules',
            name: 'Training Modules',
            component: () => import('@/views/DigitalLibrary/TrainingModules'),
            meta: { leftPanelSection: 'digitallibrary' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/digitallibrary/forms',
            name: 'Forms',
            component: () => import('@/views/DigitalLibrary/Forms'),
            meta: { leftPanelSection: 'digitallibrary' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/digitallibrary/links',
            name: 'Links',
            component: () => import('@/views/DigitalLibrary/Links'),
            meta: { leftPanelSection: 'digitallibrary' },
            beforeEnter: AuthGuard,
        },
        // DATA MANAGEMENT
        {
            path: '/datamanagement/facilitylist',
            name: 'Facility List',
            component: () => import('@/views/DataManagement/FacilityList'),
            meta: { leftPanelSection: 'datamanagement' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/datamanagement/facilitylist/facilitypage/:id',
            name: 'Facility Page',
            component: () => import('@/views/DataManagement/FacilityPage'),
            meta: { leftPanelSection: 'datamanagement' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/datamanagement/facilitylist/chemicalpage/:id',
            name: 'Chemical Page',
            component: () => import('@/views/DataManagement/ChemicalPage'),
            meta: { leftPanelSection: 'datamanagement' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/datamanagement/facilitylist/orgchart/:id',
            name: 'Default Organization Chart',
            component: () => import('@/views/DataManagement/DefaultOrgChart'),
            meta: { leftPanelSection: 'datamanagement' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/datamanagement/facilitylist/resources/:id',
            name: 'Default Resources',
            component: () => import('@/views/DataManagement/DefaultResources'),
            meta: { leftPanelSection: 'datamanagement' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/datamanagement/facilitylist/emergencyarchive/:id',
            name: 'Emergency Archive Page',
            component: () => import('@/views/DataManagement/EmergencyArchivePage'),
            meta: { leftPanelSection: 'datamanagement' },
            beforeEnter: AuthGuard,
        },
        {
            path: '/datamanagement/facilitylist/exercisearchive/:id',
            name: 'Exercise Archive Page',
            component: () => import('@/views/DataManagement/ExerciseArchivePage'),
            meta: { leftPanelSection: 'datamanagement' },
            beforeEnter: AuthGuard,
        },
        // SYSTEM ADMIN
        {
            path: '/admin/usermanagement',
            name: 'User Management',
            component: () => import('@/views/SystemAdmin/UserManagement'),
            meta: { leftPanelSection: 'systemadmin' },
            beforeEnter: AuthGuard,
        },
        // TEST
        {
            path: '/test',
            name: 'Test Page',
            component: () => import('@/views/Test'),
        },
        // UNIDENTIFIED PAGE REQUEST
        {
            path: '*',
            name: 'Error404',
            component: () => import('@/views/Error404.vue'),
        },
    ],
})
