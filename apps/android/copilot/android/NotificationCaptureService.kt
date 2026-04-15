package com.hermetic.copilot

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import java.util.Calendar

class NotificationCaptureService : NotificationListenerService() {
    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val pkg = sbn.packageName ?: return
        val extras = sbn.notification.extras
        val title = extras.getString(Notification.EXTRA_TITLE) ?: ""
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""

        val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
        val category = CopilotEngine.mapCategory(pkg)

        val event = NotificationEvent(
            packageName = pkg,
            title = title,
            text = text,
            category = category,
            hour = hour
        )

        val suggestions = CopilotEngine.suggest(event)
        val line = "[$category] $pkg | $title | ${suggestions.joinToString { it.label }}"
        CopilotEventBus.push(line)
    }
}
