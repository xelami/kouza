export interface FlashcardStats {
  totalCards: number
  reviewed: number
  toReview: number
}

export interface Module {
  id: number
  title: string
  slug: string
  description: string | null
  flashcards: {
    id: number
    lastReviewed: Date | null
    nextReview: Date | null
  }[]
}

export interface ReviseStats {
  id: number
  createdAt: Date
  updatedAt: Date
  userId: number
  nextReview: Date | null
  module: {
    title: string
    course: {
      title: string
    }
  }
}

export interface Subscription {
  id: string
  status: string
  currentPeriodEnd: Date
  currentPeriodStart: Date
  stripeSubscriptionId: string
  items: {
    price: {
      product: {
        name: string
      }
      unit_amount: number
      recurring: {
        interval: string
      }
    }
  }[]
}

export interface Lesson {
  id: number
  title: string
  slug: string
  content: string | null
  moduleId: number
  quiz: any
  media: any
  order: number
  completed: boolean
  description?: string | null
}

export interface CourseModule {
  id: number
  title: string
  slug: string
  description: string | null
  order: number
  courseId: number
  lessons?: Lesson[]
}

export interface Course {
  id: number
  title: string
  description: string | null
  modules?: CourseModule[]
  slug: string
  createdAt: Date
  updatedAt: Date
  prompt: string
  modulesJson: any
  generatedBy: number | null
  user: {
    id: number
  }
}

export interface Note {
  id: number
  title: string
  description: string | null
}

export interface Flashcard {
  id: number
  question: string
  answer: string
  lastReviewed: Date | null
  nextReview: Date | null
  course: {
    id: number
    title: string
  }
  module: {
    id: number
    title: string
  }
}

export interface DbFlashcard extends Flashcard {
  course: {
    id: number
    title: string
    slug: string
    description: string | null
  }
}

export type PrismaError = {
  code: string
  message: string
  name?: string
}

export interface Quiz {
  questions: {
    question: string
    options: string[]
    correctAnswer: number
  }[]
}
