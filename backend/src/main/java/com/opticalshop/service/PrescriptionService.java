package com.opticalshop.service;

import com.opticalshop.model.Prescription;
import com.opticalshop.model.User;
import com.opticalshop.repository.PrescriptionRepository;
import com.opticalshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Prescription savePrescription(String username, String familyMemberName, 
                                        LocalDateTime expiryDate, MultipartFile file) {
        // Find user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Store file
        String fileName = fileStorageService.storeFile(file);

        // Create prescription
        Prescription prescription = new Prescription();
        prescription.setUser(user);
        prescription.setFamilyMemberName(familyMemberName);
        prescription.setImagePath(fileName);
        prescription.setExpiryDate(expiryDate);
        prescription.setUploadDate(LocalDateTime.now());

        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getUserPrescriptions(String username) {
        return prescriptionRepository.findByUserUsername(username);
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public void deletePrescription(Long id) {
        Optional<Prescription> prescription = prescriptionRepository.findById(id);
        if (prescription.isPresent()) {
            // Delete file from storage
            String imagePath = prescription.get().getImagePath();
            if (imagePath != null) {
                fileStorageService.deleteFile(imagePath);
            }
            // Delete prescription record
            prescriptionRepository.deleteById(id);
        } else {
            throw new RuntimeException("Prescription not found");
        }
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }
}
