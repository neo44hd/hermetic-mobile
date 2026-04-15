package com.hermetic.copilot

data class NotificationEvent(
    val packageName: String,
    val title: String,
    val text: String,
    val category: String,
    val hour: Int
)

data class Suggestion(
    val action: String,
    val label: String,
    val priority: Int
)

object CopilotEngine {
    private val priorityWords = setOf("urgente", "asap", "importante", "jefe", "boss", "mamá", "mama", "papá", "papa")

    fun mapCategory(packageName: String): String {
        val p = packageName.lowercase()
        return when {
            "whatsapp" in p || "telegram" in p || "messenger" in p || "discord" in p -> "msg"
            "phone" in p || "dialer" in p -> "call"
            "instagram" in p || "facebook" in p || "x." in p || "twitter" in p || "reddit" in p -> "social"
            else -> "system"
        }
    }

    private fun score(e: NotificationEvent): Int {
        val text = "${e.title} ${e.text}".lowercase()
        var s = 0
        if (priorityWords.any { it in text }) s += 4
        if (e.category == "call") s += 3
        if ("urgente" in text) s += 3
        if (e.hour >= 23 || e.hour < 8) s -= 1
        return s
    }

    fun suggest(e: NotificationEvent): List<Suggestion> {
        val s = score(e)
        val actions = mutableListOf(
            Suggestion("open_app", "Abrir app", 2)
        )

        if (e.category == "msg" || e.category == "social") {
            actions += Suggestion("reply_later_15m", "Responder en 15 min", 3)
            actions += Suggestion("mute_1h", "Silenciar 1h", 2)
        }

        if (e.category == "call") {
            actions += Suggestion("call_back", "Devolver llamada", 3)
        }

        if (s >= 5) {
            actions += Suggestion("mark_important", "Marcar importante", 4)
        }

        return actions.sortedByDescending { it.priority }.take(3)
    }
}
