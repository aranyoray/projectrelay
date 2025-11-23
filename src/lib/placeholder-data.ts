import { Project, ProjectArea, ProjectCategory, TimeCommitment, CommitmentLevel } from './database'

export const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Ocean Plastic Cleanup Initiative',
    age_months: 18,
    time_commitment: '5-10',
    category: 'initiative',
    area: 'nonprofit',
    description: 'A student-led initiative focused on removing microplastics from local waterways. We organize monthly beach cleanups and partner with marine biology researchers to study plastic degradation patterns.',
    notes_recognitions: 'Featured in local news, received Environmental Youth Award 2024, partnered with 3 local schools',
    website_url: 'https://example.com/ocean-cleanup',
    price: 50,
    is_active: true,
    commitment_level: 'medium',
    state: 'CA',
    created_at: '2024-06-15T10:00:00Z',
    updated_at: '2024-06-15T10:00:00Z'
  },
  {
    id: '2',
    user_id: 'user-2',
    name: 'CodeMentors Academy',
    age_months: 24,
    time_commitment: '10-15',
    category: 'organization',
    area: 'tech',
    description: 'A peer-to-peer coding education platform connecting high school students with college CS majors. We offer free tutoring in Python, Java, and web development to underserved communities.',
    notes_recognitions: 'Taught 200+ students, 85% reported improved grades, partnered with Google Code Next',
    materials_url: 'https://drive.google.com/codementors',
    price: 75,
    is_active: true,
    commitment_level: 'high',
    state: 'NY',
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    user_id: 'user-3',
    name: 'Youth Mental Health Podcast',
    age_months: 8,
    time_commitment: '2-5',
    category: 'project',
    area: 'journalism',
    description: 'Weekly podcast featuring conversations with teens about mental health, stress management, and building resilience. Each episode includes expert interviews and student perspectives.',
    notes_recognitions: '5,000+ downloads, featured on Spotify Student Picks',
    video_url: 'https://youtube.com/youthmentalhealth',
    is_active: true,
    commitment_level: 'low',
    state: 'TX',
    created_at: '2024-09-01T09:00:00Z',
    updated_at: '2024-09-01T09:00:00Z'
  },
  {
    id: '4',
    user_id: 'user-4',
    name: 'Renewable Energy Research Lab',
    age_months: 36,
    time_commitment: '15-20',
    category: 'project',
    area: 'science_research',
    description: 'Student research team investigating novel solar cell materials using perovskite compounds. Collaboration with university lab resulted in two published papers on energy conversion efficiency.',
    notes_recognitions: 'Intel ISEF Finalist, 2 peer-reviewed publications, collaboration with Stanford materials lab',
    materials_url: 'https://drive.google.com/renewablelab',
    price: 100,
    is_active: true,
    commitment_level: 'high',
    state: 'MA',
    created_at: '2023-06-10T11:00:00Z',
    updated_at: '2023-06-10T11:00:00Z'
  },
  {
    id: '5',
    user_id: 'user-5',
    name: 'FoodShare App',
    age_months: 12,
    time_commitment: '5-10',
    category: 'project',
    area: 'tech',
    description: 'Mobile app connecting restaurants with excess food to local shelters and food banks. Reduced food waste by 30% in pilot program while feeding 500+ families weekly.',
    notes_recognitions: 'Congressional App Challenge Winner, featured in TechCrunch, 10 restaurant partners',
    website_url: 'https://foodshareapp.io',
    price: 80,
    is_active: true,
    commitment_level: 'medium',
    state: 'WA',
    created_at: '2024-03-15T16:00:00Z',
    updated_at: '2024-03-15T16:00:00Z'
  },
  {
    id: '6',
    user_id: 'user-6',
    name: 'Robotics for Accessibility',
    age_months: 20,
    time_commitment: '10-15',
    category: 'organization',
    area: 'engineering',
    description: 'Building affordable assistive devices for disabled students using 3D printing and Arduino. Projects include adaptive controllers, voice-activated tools, and mobility aids.',
    notes_recognitions: 'FIRST Robotics Innovation Award, helped 15 students, featured at Maker Faire',
    video_url: 'https://youtube.com/roboticsaccess',
    price: 60,
    is_active: true,
    commitment_level: 'high',
    state: 'IL',
    created_at: '2024-02-28T13:00:00Z',
    updated_at: '2024-02-28T13:00:00Z'
  },
  {
    id: '7',
    user_id: 'user-7',
    name: 'Student Journalist Network',
    age_months: 30,
    time_commitment: '5-10',
    category: 'organization',
    area: 'journalism',
    description: 'Network of high school journalists covering local civic issues. We train students in investigative reporting and help place articles in regional publications.',
    notes_recognitions: 'Published 50+ articles in local papers, trained 100 student journalists',
    website_url: 'https://studentjournalistnetwork.org',
    is_active: true,
    commitment_level: 'medium',
    state: 'PA',
    created_at: '2023-09-20T10:30:00Z',
    updated_at: '2023-09-20T10:30:00Z'
  },
  {
    id: '8',
    user_id: 'user-8',
    name: 'Community Garden Project',
    age_months: 48,
    time_commitment: '2-5',
    category: 'initiative',
    area: 'nonprofit',
    description: 'Urban garden providing fresh produce to food deserts. Students learn sustainable farming while donating 80% of harvest to local families in need.',
    notes_recognitions: 'Mayor\'s Youth Service Award, grew 2000 lbs of produce, 50 regular volunteers',
    materials_url: 'https://drive.google.com/communitygarden',
    price: 40,
    is_active: true,
    commitment_level: 'low',
    state: 'OH',
    created_at: '2022-06-01T08:00:00Z',
    updated_at: '2022-06-01T08:00:00Z'
  },
  {
    id: '9',
    user_id: 'user-9',
    name: 'AI Tutoring Platform',
    age_months: 6,
    time_commitment: '20+',
    category: 'project',
    area: 'tech',
    description: 'Building an AI-powered tutoring system that adapts to individual student learning styles. Currently in beta with 50 users showing 20% improvement in test scores.',
    notes_recognitions: 'Y Combinator applicant, $5K grant from local foundation',
    website_url: 'https://aitutor.dev',
    price: 90,
    is_active: true,
    commitment_level: 'high',
    state: 'CA',
    created_at: '2024-10-01T12:00:00Z',
    updated_at: '2024-10-01T12:00:00Z'
  },
  {
    id: '10',
    user_id: 'user-10',
    name: 'Wildlife Conservation Club',
    age_months: 15,
    time_commitment: '5-10',
    category: 'organization',
    area: 'science_research',
    description: 'Student organization conducting wildlife surveys and habitat restoration. We use camera traps and citizen science methods to monitor local species populations.',
    notes_recognitions: 'Identified 3 rare species, data shared with state wildlife agency',
    materials_url: 'https://drive.google.com/wildlifeclub',
    is_active: true,
    commitment_level: 'medium',
    state: 'CO',
    created_at: '2024-04-10T15:00:00Z',
    updated_at: '2024-04-10T15:00:00Z'
  },
  {
    id: '11',
    user_id: 'user-11',
    name: 'Financial Literacy Workshop',
    age_months: 10,
    time_commitment: '2-5',
    category: 'initiative',
    area: 'nonprofit',
    description: 'Monthly workshops teaching teens about budgeting, investing, and avoiding debt. Developed curriculum now used by 5 local schools.',
    notes_recognitions: 'Reached 300 students, partnered with local credit union',
    video_url: 'https://youtube.com/finliteracy',
    price: 35,
    is_active: true,
    commitment_level: 'low',
    state: 'FL',
    created_at: '2024-07-20T11:00:00Z',
    updated_at: '2024-07-20T11:00:00Z'
  },
  {
    id: '12',
    user_id: 'user-12',
    name: 'Drone Delivery Research',
    age_months: 14,
    time_commitment: '10-15',
    category: 'project',
    area: 'engineering',
    description: 'Researching autonomous drone systems for medical supply delivery in rural areas. Built 3 prototypes and conducted 50+ test flights.',
    notes_recognitions: 'Regeneron Science Talent Search semifinalist, FAA Part 107 certified team',
    materials_url: 'https://drive.google.com/droneresearch',
    price: 85,
    is_active: true,
    commitment_level: 'high',
    state: 'AZ',
    created_at: '2024-05-05T14:00:00Z',
    updated_at: '2024-05-05T14:00:00Z'
  },
  {
    id: '13',
    user_id: 'user-13',
    name: 'Immigrant Support Network',
    age_months: 22,
    time_commitment: '5-10',
    category: 'organization',
    area: 'nonprofit',
    description: 'Providing translation services, tutoring, and community resources to immigrant families. Network of 30 bilingual student volunteers serving 100 families monthly.',
    notes_recognitions: 'State Volunteer Award, featured in immigrant advocacy publications',
    website_url: 'https://immigrantsupport.org',
    is_active: true,
    commitment_level: 'medium',
    state: 'NJ',
    created_at: '2024-01-05T09:30:00Z',
    updated_at: '2024-01-05T09:30:00Z'
  },
  {
    id: '14',
    user_id: 'user-14',
    name: 'Climate Data Visualization',
    age_months: 9,
    time_commitment: '5-10',
    category: 'project',
    area: 'tech',
    description: 'Interactive web platform visualizing local climate change data. Users can explore temperature trends, precipitation patterns, and sea level projections.',
    notes_recognitions: 'Used by 2 high school science departments',
    website_url: 'https://climateviz.app',
    price: 55,
    is_active: true,
    commitment_level: 'medium',
    state: 'OR',
    created_at: '2024-08-15T10:00:00Z',
    updated_at: '2024-08-15T10:00:00Z'
  },
  {
    id: '15',
    user_id: 'user-15',
    name: 'Senior Tech Support',
    age_months: 16,
    time_commitment: '2-5',
    category: 'initiative',
    area: 'nonprofit',
    description: 'Students helping seniors learn to use smartphones, tablets, and video calling. Weekly sessions at community centers and assisted living facilities.',
    notes_recognitions: 'Helped 150 seniors, featured on local TV',
    is_active: true,
    commitment_level: 'low',
    state: 'MI',
    created_at: '2024-03-01T13:00:00Z',
    updated_at: '2024-03-01T13:00:00Z'
  },
  {
    id: '16',
    user_id: 'user-16',
    name: 'Bioplastics Research Team',
    age_months: 11,
    time_commitment: '10-15',
    category: 'project',
    area: 'science_research',
    description: 'Developing biodegradable plastics from agricultural waste. Testing material properties and working with local businesses on potential applications.',
    notes_recognitions: 'Patent pending, presented at American Chemical Society conference',
    materials_url: 'https://drive.google.com/bioplastics',
    price: 70,
    is_active: true,
    commitment_level: 'high',
    state: 'IA',
    created_at: '2024-06-20T11:30:00Z',
    updated_at: '2024-06-20T11:30:00Z'
  },
  {
    id: '17',
    user_id: 'user-17',
    name: 'Youth Civic Engagement',
    age_months: 28,
    time_commitment: '5-10',
    category: 'organization',
    area: 'journalism',
    description: 'Nonpartisan organization encouraging youth voter registration and civic participation. We organize debates, town halls, and voter registration drives.',
    notes_recognitions: 'Registered 500 new voters, hosted 10 candidate forums',
    website_url: 'https://youthcivic.org',
    is_active: true,
    commitment_level: 'medium',
    state: 'GA',
    created_at: '2023-10-15T16:00:00Z',
    updated_at: '2023-10-15T16:00:00Z'
  },
  {
    id: '18',
    user_id: 'user-18',
    name: 'Smart Irrigation System',
    age_months: 7,
    time_commitment: '5-10',
    category: 'project',
    area: 'engineering',
    description: 'IoT-based irrigation system using soil sensors and weather data to optimize water usage. Reduced water consumption by 40% in school garden pilot.',
    notes_recognitions: 'Engineering fair first place, interest from 3 local farms',
    video_url: 'https://youtube.com/smartirrigation',
    price: 65,
    is_active: true,
    commitment_level: 'medium',
    state: 'NM',
    created_at: '2024-09-10T14:30:00Z',
    updated_at: '2024-09-10T14:30:00Z'
  },
  {
    id: '19',
    user_id: 'user-19',
    name: 'Music Therapy Program',
    age_months: 19,
    time_commitment: '2-5',
    category: 'initiative',
    area: 'nonprofit',
    description: 'Bringing music therapy to pediatric hospital patients. Student musicians perform weekly and lead interactive music sessions with young patients.',
    notes_recognitions: 'Served 200 patients, endorsed by hospital child life department',
    is_active: true,
    commitment_level: 'low',
    state: 'TN',
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z'
  },
  {
    id: '20',
    user_id: 'user-20',
    name: 'Cybersecurity Education',
    age_months: 13,
    time_commitment: '10-15',
    category: 'organization',
    area: 'tech',
    description: 'Teaching cybersecurity fundamentals to middle schoolers through interactive workshops and capture-the-flag competitions. Curriculum covers password safety, phishing, and digital privacy.',
    notes_recognitions: 'CyberPatriot state finalist, trained 150 students, partnered with local tech company',
    website_url: 'https://cybered.io',
    price: 45,
    is_active: true,
    commitment_level: 'high',
    state: 'VA',
    created_at: '2024-04-25T09:00:00Z',
    updated_at: '2024-04-25T09:00:00Z'
  }
]

export const PROJECT_AREAS: { value: ProjectArea; label: string }[] = [
  { value: 'science_research', label: 'Science Research' },
  { value: 'tech', label: 'Technology' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'journalism', label: 'Journalism' },
  { value: 'nonprofit', label: 'Non-profit' },
  { value: 'other', label: 'Other' }
]

export const PROJECT_CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'project', label: 'Project' },
  { value: 'initiative', label: 'Initiative' },
  { value: 'organization', label: 'Organization' }
]

export const TIME_COMMITMENTS: { value: TimeCommitment; label: string }[] = [
  { value: '1-2', label: '1-2 hrs/week' },
  { value: '2-5', label: '2-5 hrs/week' },
  { value: '5-10', label: '5-10 hrs/week' },
  { value: '10-15', label: '10-15 hrs/week' },
  { value: '15-20', label: '15-20 hrs/week' },
  { value: '20+', label: '20+ hrs/week' }
]

export const COMMITMENT_LEVELS: { value: CommitmentLevel; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

export const PROJECT_AGES: { value: string; label: string }[] = [
  { value: '0-6m', label: '0-6 months' },
  { value: '6m-1y', label: '6 months - 1 year' },
  { value: '1y-3y', label: '1-3 years' },
  { value: '3y-5y', label: '3-5 years' },
  { value: '5y+', label: '5+ years' }
]

export function getProjectAgeLabel(months: number): string {
  if (months < 6) return '0-6 months'
  if (months < 12) return '6 months - 1 year'
  if (months < 36) return '1-3 years'
  if (months < 60) return '3-5 years'
  return '5+ years'
}

export function formatTimeCommitment(commitment: TimeCommitment): string {
  const found = TIME_COMMITMENTS.find(t => t.value === commitment)
  return found?.label || commitment
}

export function formatArea(area: ProjectArea): string {
  const found = PROJECT_AREAS.find(a => a.value === area)
  return found?.label || area
}

export function formatCategory(category: ProjectCategory): string {
  const found = PROJECT_CATEGORIES.find(c => c.value === category)
  return found?.label || category
}
