import Timeline from "react-timeline"

export default function ProgressTimeline({ sessions }: { sessions: any[] }) {
  const events = sessions.map((s) => ({
    ts: s.startTime,
    text: `Studied ${s.lessonId}`,
  }))

  if (sessions.length === 0) {
    return <div>No sessions found</div>
  }

  return <Timeline events={events} />
}
