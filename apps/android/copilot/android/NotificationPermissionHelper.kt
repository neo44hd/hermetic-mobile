package com.hermetic.copilot

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.provider.Settings

object NotificationPermissionHelper {
    fun openNotificationAccessSettings(context: Context) {
        context.startActivity(
            Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        )
    }

    fun isNotificationListenerEnabled(context: Context, serviceClass: Class<*>): Boolean {
        val cn = ComponentName(context, serviceClass)
        val flat = Settings.Secure.getString(context.contentResolver, "enabled_notification_listeners") ?: return false
        return flat.contains(cn.flattenToString())
    }
}
