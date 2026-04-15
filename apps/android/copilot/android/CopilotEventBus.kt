package com.hermetic.copilot

object CopilotEventBus {
    private val _events = mutableListOf<String>()

    @Synchronized
    fun push(event: String) {
        _events.add(0, event)
        if (_events.size > 100) _events.removeLast()
    }

    @Synchronized
    fun snapshot(): List<String> = _events.toList()

    @Synchronized
    fun clear() = _events.clear()
}
