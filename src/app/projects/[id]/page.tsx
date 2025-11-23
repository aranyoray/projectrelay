'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Project } from '@/lib/database'
import {
  PLACEHOLDER_PROJECTS,
  formatTimeCommitment,
  formatArea,
  formatCategory,
  getProjectAgeLabel
} from '@/lib/placeholder-data'
import { AuthService } from '@/lib/auth'

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [transferMessage, setTransferMessage] = useState('')
  const [offerAmount, setOfferAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [weeklyRequests, setWeeklyRequests] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const foundProject = PLACEHOLDER_PROJECTS.find(p => p.id === projectId)
    if (foundProject) {
      setProject(foundProject)
    }

    const guestMode = localStorage.getItem('guestMode')
    if (guestMode === 'true') {
      setIsGuest(true)
    } else {
      AuthService.getCurrentUser().then(({ user }) => {
        if (user) {
          setUserId(user.id)
        }
      })
    }

    const savedBookmarks = localStorage.getItem('bookmarks')
    if (savedBookmarks) {
      const bookmarks = new Set(JSON.parse(savedBookmarks))
      setIsBookmarked(bookmarks.has(projectId))
    }

    const requests = localStorage.getItem('weeklyRequests')
    if (requests) {
      setWeeklyRequests(parseInt(requests))
    }
  }, [projectId])

  const toggleBookmark = () => {
    if (isGuest) {
      alert('Please sign in to bookmark projects')
      return
    }

    const savedBookmarks = localStorage.getItem('bookmarks')
    const bookmarks = savedBookmarks ? new Set(JSON.parse(savedBookmarks)) : new Set()

    if (isBookmarked) {
      bookmarks.delete(projectId)
    } else {
      bookmarks.add(projectId)
    }

    localStorage.setItem('bookmarks', JSON.stringify([...bookmarks]))
    setIsBookmarked(!isBookmarked)
  }

  const handleContact = async () => {
    if (isGuest) {
      alert('Please sign in to contact project owners')
      return
    }

    if (!contactMessage.trim()) {
      setError('Please enter a message')
      return
    }

    if (weeklyRequests >= 10) {
      setError('You have reached your weekly request limit (10). Upgrade to premium for more.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newCount = weeklyRequests + 1
      setWeeklyRequests(newCount)
      localStorage.setItem('weeklyRequests', newCount.toString())

      setSubmitSuccess(true)
      setContactMessage('')

      setTimeout(() => {
        setShowContactModal(false)
        setSubmitSuccess(false)
      }, 2000)
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTransferRequest = async () => {
    if (isGuest) {
      alert('Please sign in to request project transfers')
      return
    }

    if (!transferMessage.trim()) {
      setError('Please enter a message')
      return
    }

    if (weeklyRequests >= 10) {
      setError('You have reached your weekly request limit (10). Upgrade to premium for more.')
      return
    }

    const amount = parseFloat(offerAmount)
    if (project?.price && offerAmount && (isNaN(amount) || amount < 0 || amount > 100)) {
      setError('Offer amount must be between $0 and $100')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newCount = weeklyRequests + 1
      setWeeklyRequests(newCount)
      localStorage.setItem('weeklyRequests', newCount.toString())

      setSubmitSuccess(true)
      setTransferMessage('')
      setOfferAmount('')

      setTimeout(() => {
        setShowTransferModal(false)
        setSubmitSuccess(false)
      }, 2000)
    } catch (err) {
      setError('Failed to send transfer request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <div className="project-not-found">
          <h2>Project not found</h2>
          <button className="btn-primary" onClick={() => router.push('/projects')}>
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="project-detail-page">
      <header className="detail-header">
        <button className="btn-back" onClick={() => router.push('/projects')}>
          &larr; Back to Projects
        </button>
        <div className="header-actions">
          <button
            className={`bookmark-btn-large ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={toggleBookmark}
          >
            {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
          </button>
        </div>
      </header>

      <main className="detail-main">
        <div className="detail-content">
          <div className="detail-badges">
            <span className={`commitment-badge ${project.commitment_level}`}>
              {project.commitment_level} commitment
            </span>
            <span className="category-badge">{formatCategory(project.category)}</span>
            <span className="area-badge">{formatArea(project.area)}</span>
          </div>

          <h1>{project.name}</h1>

          <div className="detail-meta">
            <div className="meta-item">
              <strong>Location:</strong> {project.state || 'Not specified'}
            </div>
            <div className="meta-item">
              <strong>Time Commitment:</strong> {formatTimeCommitment(project.time_commitment)}
            </div>
            <div className="meta-item">
              <strong>Project Age:</strong> {getProjectAgeLabel(project.age_months)}
            </div>
            {project.price && (
              <div className="meta-item price">
                <strong>Transfer Fee:</strong> ${project.price}
              </div>
            )}
          </div>

          <section className="detail-section">
            <h2>Description</h2>
            <p>{project.description}</p>
          </section>

          {project.notes_recognitions && (
            <section className="detail-section">
              <h2>Notes & Recognitions</h2>
              <p>{project.notes_recognitions}</p>
            </section>
          )}

          <section className="detail-section links-section">
            <h2>Project Links</h2>
            <div className="project-links">
              {project.website_url && (
                <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="project-link">
                  Website
                </a>
              )}
              {project.video_url && (
                <a href={project.video_url} target="_blank" rel="noopener noreferrer" className="project-link">
                  Video
                </a>
              )}
              {project.materials_url && (
                <a href={project.materials_url} target="_blank" rel="noopener noreferrer" className="project-link">
                  Materials
                </a>
              )}
              {!project.website_url && !project.video_url && !project.materials_url && (
                <p className="no-links">No external links provided</p>
              )}
            </div>
          </section>
        </div>

        <aside className="detail-sidebar">
          <div className="action-card">
            <h3>Interested in this project?</h3>
            <p>Contact the owner or request a transfer.</p>

            <div className="request-counter">
              <span>Weekly requests: {weeklyRequests}/10</span>
            </div>

            <button
              className="btn-primary btn-full"
              onClick={() => setShowContactModal(true)}
            >
              Contact Owner
            </button>

            <button
              className="btn-secondary btn-full"
              onClick={() => setShowTransferModal(true)}
            >
              Request Transfer
            </button>

            {isGuest && (
              <p className="guest-warning">
                Sign in to contact owners and request transfers
              </p>
            )}
          </div>
        </aside>
      </main>

      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contact Project Owner</h3>
              <button className="modal-close" onClick={() => setShowContactModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {submitSuccess ? (
                <div className="success-message">
                  Message sent successfully!
                </div>
              ) : (
                <>
                  <p>Send a message to the owner of "{project.name}"</p>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Introduce yourself and explain your interest in this project..."
                    rows={5}
                    className="modal-textarea"
                  />
                  {error && <div className="error-message">{error}</div>}
                </>
              )}
            </div>
            {!submitSuccess && (
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowContactModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleContact}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showTransferModal && (
        <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Project Transfer</h3>
              <button className="modal-close" onClick={() => setShowTransferModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {submitSuccess ? (
                <div className="success-message">
                  Transfer request sent successfully!
                </div>
              ) : (
                <>
                  <p>Request to take over "{project.name}"</p>
                  <textarea
                    value={transferMessage}
                    onChange={(e) => setTransferMessage(e.target.value)}
                    placeholder="Explain why you're interested in taking over this project and your qualifications..."
                    rows={5}
                    className="modal-textarea"
                  />
                  {project.price && (
                    <div className="offer-section">
                      <label>Your Offer (max $100)</label>
                      <input
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        placeholder={`Suggested: $${project.price}`}
                        min="0"
                        max="100"
                        className="offer-input"
                      />
                    </div>
                  )}
                  {error && <div className="error-message">{error}</div>}
                </>
              )}
            </div>
            {!submitSuccess && (
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowTransferModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleTransferRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
