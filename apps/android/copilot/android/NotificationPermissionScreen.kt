package com.hermetic.copilot

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp

@Composable
fun NotificationPermissionScreen() {
    val ctx = LocalContext.current
    var enabled by remember {
        mutableStateOf(
            NotificationPermissionHelper.isNotificationListenerEnabled(ctx, NotificationCaptureService::class.java)
        )
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Notification Listener", style = MaterialTheme.typography.titleMedium)
        Text(if (enabled) "Estado: ACTIVADO ✅" else "Estado: DESACTIVADO ❌")

        Button(onClick = { NotificationPermissionHelper.openNotificationAccessSettings(ctx) }) {
            Text("Abrir ajustes de acceso")
        }

        OutlinedButton(onClick = {
            enabled = NotificationPermissionHelper.isNotificationListenerEnabled(ctx, NotificationCaptureService::class.java)
        }) {
            Text("Revisar estado")
        }
    }
}
