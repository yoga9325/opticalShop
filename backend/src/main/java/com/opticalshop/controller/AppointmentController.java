package com.opticalshop.controller;

import com.opticalshop.model.Appointment;
import com.opticalshop.service.AppointmentService;
import com.opticalshop.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication; // Depending on your auth setup
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;
    
    // Simplistic user retrieval for now, replace with your actual auth logic
    // Assuming the frontend sends user ID or we extract from token
    
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        LocalDate date = LocalDate.parse(payload.get("date").toString());
        LocalTime time = LocalTime.parse(payload.get("time").toString());
        String purpose = (String) payload.get("purpose");

        Appointment appointment = appointmentService.bookAppointment(username, date, time, purpose);
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getUserAppointments(@PathVariable Long userId) {
        return ResponseEntity.ok(appointmentService.getUserAppointments(userId));
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(@RequestParam String username) {
        return ResponseEntity.ok(appointmentService.getUserAppointmentsByUsername(username));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, Appointment.AppointmentStatus.valueOf(status)));
    }
}
