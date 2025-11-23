'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Project, ProjectArea, CommitmentLevel } from '@/lib/database'
import {
  PLACEHOLDER_PROJECTS,
  PROJECT_AREAS,
  COMMITMENT_LEVELS,
  PROJECT_AGES,
  formatTimeCommitment,
  formatArea,
  formatCategory,
  getProjectAgeLabel
} from '@/lib/placeholder-data'
import { AuthService } from '@/lib/auth'

const US_STATES = [
  { value: '', label: 'All States' },
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'FL', label: 'Florida' },
  { value: 'IL', label: 'Illinois' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'OH', label: 'Ohio' },
  { value: 'GA', label: 'Georgia' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'MI', label: 'Michigan' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'IN', label: 'Indiana' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MD', label: 'Maryland' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'CO', label: 'Colorado' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'AL', label: 'Alabama' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'OR', label: 'Oregon' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'IA', label: 'Iowa' },
  { value: 'NM', label: 'New Mexico' }
]

export default function ProjectsPage() {
  const router = useRouter()
  const [isGuest, setIsGuest] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [areaFilter, setAreaFilter] = useState<ProjectArea | ''>('')
  const [stateFilter, setStateFilter] = useState('')
  const [commitmentFilter, setCommitmentFilter] = useState<CommitmentLevel | ''>('')
  const [ageFilter, setAgeFilter] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [carouselIndex, setCarouselIndex] = useState(0)

  useEffect(() => {
    const guestMode = localStorage.getItem('guestMode')
    if (guestMode === 'true') {
      setIsGuest(true)
    }

    const savedBookmarks = localStorage.getItem('bookmarks')
    if (savedBookmarks) {
      setBookmarkedIds(new Set(JSON.parse(savedBookmarks)))
    }
  }, [])

  const filteredProjects = PLACEHOLDER_PROJECTS.filter(project => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!project.name.toLowerCase().includes(query) &&
          !project.description.toLowerCase().includes(query)) {
        return false
      }
    }
    if (areaFilter && project.area !== areaFilter) return false
    if (stateFilter && project.state !== stateFilter) return false
    if (commitmentFilter && project.commitment_level !== commitmentFilter) return false
    if (ageFilter) {
      const months = project.age_months
      if (ageFilter === '0-6m' && months >= 6) return false
      if (ageFilter === '6m-1y' && (months < 6 || months >= 12)) return false
      if (ageFilter === '1y-3y' && (months < 12 || months >= 36)) return false
      if (ageFilter === '3y-5y' && (months < 36 || months >= 60)) return false
      if (ageFilter === '5y+' && months < 60) return false
    }
    return true
  })

  const recommendedProjects = PLACEHOLDER_PROJECTS.slice(0, 5)

  const toggleBookmark = (projectId: string) => {
    if (isGuest) {
      alert('Please sign in to bookmark projects')
      return
    }

    const newBookmarks = new Set(bookmarkedIds)
    if (newBookmarks.has(projectId)) {
      newBookmarks.delete(projectId)
    } else {
      newBookmarks.add(projectId)
    }
    setBookmarkedIds(newBookmarks)
    localStorage.setItem('bookmarks', JSON.stringify([...newBookmarks]))
  }

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % recommendedProjects.length)
  }

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + recommendedProjects.length) % recommendedProjects.length)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setAreaFilter('')
    setStateFilter('')
    setCommitmentFilter('')
    setAgeFilter('')
  }

  return (
    <div className="projects-page">
      <header className="projects-header">
        <div className="projects-header-content">
          <h1>Project Relay</h1>
          <div className="header-actions">
            {isGuest ? (
              <button
                className="btn-secondary"
                onClick={() => {
                  localStorage.removeItem('guestMode')
                  router.push('/auth')
                }}
              >
                Sign In
              </button>
            ) : (
              <button
                className="btn-secondary"
                onClick={async () => {
                  await AuthService.signOut()
                  router.push('/auth')
                }}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="projects-main">
        <section className="recommended-section">
          <h2>Recommended For You</h2>
          <div className="carousel-container">
            <button className="carousel-btn prev" onClick={prevCarousel}>
              &lt;
            </button>
            <div className="carousel-track">
              {recommendedProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`carousel-card ${index === carouselIndex ? 'active' : ''}`}
                  style={{
                    transform: `translateX(${(index - carouselIndex) * 100}%)`,
                    opacity: index === carouselIndex ? 1 : 0.3
                  }}
                >
                  <div className="carousel-card-content">
                    <span className="project-badge">{formatCategory(project.category)}</span>
                    <h3>{project.name}</h3>
                    <p>{project.description.slice(0, 100)}...</p>
                    <div className="project-meta">
                      <span>{formatArea(project.area)}</span>
                      <span>{project.state}</span>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      View Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-btn next" onClick={nextCarousel}>
              &gt;
            </button>
          </div>
          <div className="carousel-dots">
            {recommendedProjects.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === carouselIndex ? 'active' : ''}`}
                onClick={() => setCarouselIndex(index)}
              />
            ))}
          </div>
        </section>

        <section className="browse-section">
          <h2>Browse Projects</h2>

          <div className="search-filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filters-row">
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value as ProjectArea | '')}
                className="filter-select"
              >
                <option value="">All Areas</option>
                {PROJECT_AREAS.map(area => (
                  <option key={area.value} value={area.value}>{area.label}</option>
                ))}
              </select>

              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="filter-select"
              >
                {US_STATES.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>

              <select
                value={commitmentFilter}
                onChange={(e) => setCommitmentFilter(e.target.value as CommitmentLevel | '')}
                className="filter-select"
              >
                <option value="">All Commitment Levels</option>
                {COMMITMENT_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>

              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Ages</option>
                {PROJECT_AGES.map(age => (
                  <option key={age.value} value={age.value}>{age.label}</option>
                ))}
              </select>

              {(searchQuery || areaFilter || stateFilter || commitmentFilter || ageFilter) && (
                <button className="btn-clear" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="projects-count">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
          </div>

          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                isBookmarked={bookmarkedIds.has(project.id)}
                onBookmark={() => toggleBookmark(project.id)}
                onClick={() => router.push(`/projects/${project.id}`)}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="no-results">
              <p>No projects found matching your criteria.</p>
              <button className="btn-secondary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function ProjectCard({
  project,
  isBookmarked,
  onBookmark,
  onClick
}: {
  project: Project
  isBookmarked: boolean
  onBookmark: () => void
  onClick: () => void
}) {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <span className={`commitment-badge ${project.commitment_level}`}>
          {project.commitment_level}
        </span>
        <button
          className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onBookmark()
          }}
        >
          {isBookmarked ? '' : ''}
        </button>
      </div>

      <h3 className="project-card-title">{project.name}</h3>

      <div className="project-card-meta">
        <span className="meta-item">{formatArea(project.area)}</span>
        <span className="meta-item">{formatCategory(project.category)}</span>
        {project.state && <span className="meta-item">{project.state}</span>}
      </div>

      <p className="project-card-description">
        {project.description.length > 120
          ? `${project.description.slice(0, 120)}...`
          : project.description}
      </p>

      <div className="project-card-footer">
        <div className="project-details">
          <span>{formatTimeCommitment(project.time_commitment)}</span>
          <span>{getProjectAgeLabel(project.age_months)}</span>
        </div>
        {project.price && (
          <span className="project-price">${project.price}</span>
        )}
      </div>

      <button className="btn-view-project" onClick={onClick}>
        View Details
      </button>
    </div>
  )
}
