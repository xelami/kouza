"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@kouza/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kouza/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kouza/ui/components/dialog"
import { Input } from "@kouza/ui/components/input"
import { Label } from "@kouza/ui/components/label"
import { Textarea } from "@kouza/ui/components/textarea"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react"

interface Flashcard {
  id: number
  question: string
  answer: string
  easeFactor: number
  interval: number
  repetitions: number
  lastReviewed: string | null
  nextReview: string | null
}

interface ManageFlashcardsProps {
  flashcards: Flashcard[]
  courseId: number
  moduleId: number
  lessonId?: number
  onFlashcardsChanged: () => void
}

export default function ManageFlashcards({
  flashcards,
  courseId,
  moduleId,
  lessonId,
  onFlashcardsChanged,
}: ManageFlashcardsProps) {
  const [cards, setCards] = useState<Flashcard[]>(flashcards)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null)
  const [deletingCard, setDeletingCard] = useState<Flashcard | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setCards(flashcards)
  }, [flashcards])

  const filteredCards = cards.filter(
    (card) =>
      card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateFlashcard = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error("Question and answer are required")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/flashcards/create-manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: newQuestion,
          answer: newAnswer,
          courseId,
          moduleId,
          lessonId,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to create flashcard")
      }

      toast.success("Flashcard created successfully")
      setNewQuestion("")
      setNewAnswer("")
      setIsCreateDialogOpen(false)
      onFlashcardsChanged()
    } catch (error) {
      console.error("Error creating flashcard:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to create flashcard"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditFlashcard = async () => {
    if (
      !editingCard ||
      !editingCard.question.trim() ||
      !editingCard.answer.trim()
    ) {
      toast.error("Question and answer are required")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/flashcards/edit-flashcard", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingCard.id,
          question: editingCard.question,
          answer: editingCard.answer,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to update flashcard")
      }

      toast.success("Flashcard updated successfully")
      setIsEditDialogOpen(false)
      setEditingCard(null)
      onFlashcardsChanged()
    } catch (error) {
      console.error("Error updating flashcard:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to update flashcard"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteFlashcard = async () => {
    if (!deletingCard) return

    setIsSubmitting(true)
    try {
      const response = await fetch(
        `/api/flashcards/delete-flashcard?id=${deletingCard.id}`,
        {
          method: "DELETE",
        }
      )

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete flashcard")
      }

      toast.success("Flashcard deleted successfully")
      setIsDeleteDialogOpen(false)
      setDeletingCard(null)
      onFlashcardsChanged()
    } catch (error) {
      console.error("Error deleting flashcard:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to delete flashcard"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Manage Flashcards</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search flashcards..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Flashcard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Flashcard</DialogTitle>
                <DialogDescription>
                  Add a new flashcard to your collection.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter the question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    id="answer"
                    placeholder="Enter the answer..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateFlashcard} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Flashcard"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "No flashcards match your search"
                : "No flashcards available. Create your first flashcard!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => (
            <Card key={card.id}>
              <CardHeader>
                <CardTitle className="text-lg">{card.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{card.answer}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Dialog
                  open={isEditDialogOpen && editingCard?.id === card.id}
                  onOpenChange={(open) => {
                    setIsEditDialogOpen(open)
                    if (!open) setEditingCard(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCard(card)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Flashcard</DialogTitle>
                      <DialogDescription>
                        Make changes to your flashcard.
                      </DialogDescription>
                    </DialogHeader>
                    {editingCard && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-question">Question</Label>
                          <Textarea
                            id="edit-question"
                            value={editingCard.question}
                            onChange={(e) =>
                              setEditingCard({
                                ...editingCard,
                                question: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-answer">Answer</Label>
                          <Textarea
                            id="edit-answer"
                            value={editingCard.answer}
                            onChange={(e) =>
                              setEditingCard({
                                ...editingCard,
                                answer: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleEditFlashcard}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isDeleteDialogOpen && deletingCard?.id === card.id}
                  onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open)
                    if (!open) setDeletingCard(null)
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeletingCard(card)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Flashcard</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this flashcard? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    {deletingCard && (
                      <div className="py-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              {deletingCard.question}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{deletingCard.answer}</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteFlashcard}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Deleting..." : "Delete Flashcard"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
