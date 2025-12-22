package com.opticalshop.service;

import com.opticalshop.model.Appointment;
import com.opticalshop.model.User;
import com.opticalshop.repository.AppointmentRepository;
import com.opticalshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    public Appointment bookAppointment(String username, LocalDate date, LocalTime time, String purpose) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);
        appointment.setPurpose(purpose);
        
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getUserAppointments(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }
    
    public List<Appointment> getUserAppointmentsByUsername(String username) {
        return appointmentRepository.findByUserUsername(username);
    }

    public Appointment updateStatus(Long id, Appointment.AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
}
