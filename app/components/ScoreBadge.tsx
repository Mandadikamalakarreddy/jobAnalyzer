



const ScoreBadge = ({score}: {score: number}) => {
  const getBadgeInfo = (score: number) => {
    if (score >= 80) {
      return {
        text: "Strong",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-200",
        icon: "✓"
      }
    } else if (score >= 60) {
      return {
        text: "Good",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        borderColor: "border-blue-200",
        icon: "👍"
      }
    } else if (score >= 40) {
      return {
        text: "Needs Work",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-200",
        icon: "⚠"
      }
    } else {
      return {
        text: "Start",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-200",
        icon: "🚀"
      }
    }
  }

  const badgeInfo = getBadgeInfo(score)

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${badgeInfo.bgColor} ${badgeInfo.textColor} ${badgeInfo.borderColor}`}>
      <span className="text-xs">{badgeInfo.icon}</span>
      <span>{badgeInfo.text}</span>
    </div>
  )
}

export default ScoreBadge