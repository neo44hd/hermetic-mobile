package com.hermetic.copilot

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay

@Composable
fun NotificationDebugScreen() {
    var events by remember { mutableStateOf(CopilotEventBus.snapshot()) }

    LaunchedEffect(Unit) {
        while (true) {
            events = CopilotEventBus.snapshot()
            delay(500)
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Hermetic Notification Copilot (Debug)", style = MaterialTheme.typography.titleMedium)
        Spacer(modifier = Modifier.height(8.dp))
        Row {
            Button(onClick = { CopilotEventBus.clear(); events = emptyList() }) {
                Text("Limpiar")
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(events) { e ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = e,
                        modifier = Modifier.padding(12.dp),
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        }
    }
}
