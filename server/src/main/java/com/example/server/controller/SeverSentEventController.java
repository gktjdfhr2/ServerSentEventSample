package com.example.server.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;


@RestController
public class SeverSentEventController {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    private final ConcurrentHashMap<SseEmitter, String> users = new ConcurrentHashMap<>();



    @PostMapping("/chat")
    public void postMessage(@RequestParam String username, @RequestBody String message) {
        String formattedMessage = username + ": " + message;
        List<SseEmitter> deadEmitters = new ArrayList<>();
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name("message").data(formattedMessage));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        });
        emitters.removeAll(deadEmitters);
    }

    @GetMapping("/sse")
    public SseEmitter streamEvents(@RequestParam String username) {
        SseEmitter emitter = new SseEmitter();
        emitters.add(emitter);
        users.put(emitter, username);
        emitter.onCompletion(() -> {
            emitters.remove(emitter);
            users.remove(emitter);
            broadcast(username + " has left the chat.");
        });
        emitter.onTimeout(() -> {
            emitters.remove(emitter);
            users.remove(emitter);
            broadcast(username + " has left the chat.");
        });
        broadcast(username + " has joined the chat.");
        return emitter;
    }

    private void broadcast(String message) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name("message").data(message));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        });
        emitters.removeAll(deadEmitters);
    }
}
