'use client'
import { Button } from "@/components/ui/button"

import { CheckCircle2Icon, PopcornIcon, AlertCircleIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"

// Custom CSS Styles
const styles = `
  .message-card {
    max-width: 42rem;
    margin: 0 auto;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .message-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .card-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }

  .card-description {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }

  .card-content {
    padding: 1.5rem;
  }

  .card-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
  }

  .alert-container {
    margin: 1rem 0;
  }

  .alert {
    padding: 1rem;
    border-radius: 0.375rem;
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .alert-success {
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
  }

  .alert-info {
    background-color: #f0f9ff;
    border: 1px solid #bae6fd;
  }

  .alert-destructive {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
  }

  .alert-icon {
    flex-shrink: 0;
    height: 1.25rem;
    width: 1.25rem;
    margin-top: 0.125rem;
  }

  .alert-icon-success {
    color: #16a34a;
  }

  .alert-icon-info {
    color: #0284c7;
  }

  .alert-icon-destructive {
    color: #dc2626;
  }

  .alert-content {
    flex: 1;
  }

  .alert-title {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .alert-description {
    font-size: 0.875rem;
    color: #4b5563;
  }

  .alert-list {
    margin-top: 0.5rem;
    padding-left: 1.25rem;
    list-style-type: disc;
  }

  .alert-list li {
    margin-bottom: 0.25rem;
  }

  .delete-btn {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
  }

  .delete-btn:hover {
    background-color: #fee2e2;
  }

  .delete-dialog {
    border-radius: 0.5rem;
    max-width: 24rem;
    padding: 1.5rem;
    background-color: white;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .delete-dialog-header {
    margin-bottom: 1rem;
  }

  .delete-dialog-title {
    font-weight: 600;
    font-size: 1.125rem;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .delete-dialog-description {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .delete-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .cancel-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background-color: #f3f4f6;
    color: #111827;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cancel-btn:hover {
    background-color: #e5e7eb;
  }

  .confirm-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background-color: #ef4444;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .confirm-btn:hover {
    background-color: #dc2626;
  }

  .confirm-btn:disabled {
    background-color: #fca5a5;
    cursor: not-allowed;
  }

  /* Dark mode styles */
  @media (prefers-color-scheme: dark) {
    .message-card {
      background-color: #1f2937;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .card-header {
      border-bottom-color: #374151;
    }

    .card-title {
      color: #f9fafb;
    }

    .card-description {
      color: #9ca3af;
    }

    .card-footer {
      border-top-color: #374151;
    }

    .alert-success {
      background-color: #052e16;
      border-color: #166534;
    }

    .alert-info {
      background-color: #082f49;
      border-color: #075985;
    }

    .alert-destructive {
      background-color: #450a0a;
      border-color: #991b1b;
    }

    .alert-title {
      color: #f9fafb;
    }

    .alert-description {
      color: #d1d5db;
    }

    .delete-dialog {
      background-color: #1f2937;
    }

    .delete-dialog-title {
      color: #f9fafb;
    }

    .delete-dialog-description {
      color: #9ca3af;
    }

    .cancel-btn {
      background-color: #374151;
      color: #f9fafb;
    }

    .cancel-btn:hover {
      background-color: #4b5563;
    }
  }
`

function MessageCard() {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false)
      setShowDeleteAlert(false)
      // Add your actual delete logic here
      console.log("Message deleted")
    }, 1500)
  }

  return (
    <>
      <style>{styles}</style>
      <div className="message-card">
        <div className="card-header">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="card-title">Important Message</h2>
              <p className="card-description">
                This card contains different types of alert messages
              </p>
            </div>
            <button
              className="delete-btn"
              onClick={() => setShowDeleteAlert(true)}
            >
              <Trash2Icon className="h-5 w-5" />
            </button>
          </div>

          <div className="alert-container">
            <div className="alert alert-success">
              <CheckCircle2Icon className="alert-icon alert-icon-success" />
              <div className="alert-content">
                <h4 className="alert-title">Success! Your changes have been saved</h4>
                <p className="alert-description">
                  This is an alert with icon, title and description.
                </p>
              </div>
            </div>

            <div className="alert alert-info">
              <PopcornIcon className="alert-icon alert-icon-info" />
              <div className="alert-content">
                <h4 className="alert-title">
                  This Alert has a title and an icon. No description.
                </h4>
              </div>
            </div>

            <div className="alert alert-destructive">
              <AlertCircleIcon className="alert-icon alert-icon-destructive" />
              <div className="alert-content">
                <h4 className="alert-title">Unable to process your payment.</h4>
                <div className="alert-description">
                  <p>Please verify your billing information and try again.</p>
                  <ul className="alert-list">
                    <li>Check your card details</li>
                    <li>Ensure sufficient funds</li>
                    <li>Verify billing address</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-content">
          <p>This is the main content of the message card.</p>
        </div>

        <div className="card-footer">
          <Button variant="outline">Cancel</Button>
          <Button className="ml-2">Save Changes</Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="delete-dialog">
            <div className="delete-dialog-header">
              <h3 className="delete-dialog-title">Delete Message</h3>
              <p className="delete-dialog-description">
                Are you sure you want to delete this message? This action cannot be undone.
              </p>
            </div>
            <div className="delete-dialog-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteAlert(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MessageCard