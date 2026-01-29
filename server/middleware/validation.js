const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone.toString());
};

const validateRollNo = (rollNo) => {
  // NITT roll number format: 10 digits
  const regex = /^[0-9]{10}$/;
  return regex.test(rollNo);
};

const validateApplicationForm = (data, type) => {
  const errors = [];

  // Common validations
  if (!data.mobileNumber || !validatePhone(data.mobileNumber)) {
    errors.push('Valid mobile number required');
  }

  if (!data.gender || !['Male', 'Female', 'Other'].includes(data.gender)) {
    errors.push('Valid gender required');
  }

  if (!data.bloodGroup) {
    errors.push('Blood group required');
  }

  if (!data.dateOfBirth) {
    errors.push('Date of birth required');
  }

  if (!data.address) {
    errors.push('Address required');
  }

  if (!data.requestCategory) {
    errors.push('Request category required');
  }

  // Student-specific validations
  if (type === 'student') {
    if (!data.rollNumber || !validateRollNo(data.rollNumber)) {
      errors.push('Valid roll number required');
    }

    if (!data.studentName) {
      errors.push('Name required');
    }

    if (!data.fathersName) {
      errors.push("Father's name required");
    }

    if (!data.programme) {
      errors.push('Programme required');
    }

    if (!data.branch) {
      errors.push('Branch required');
    }

    if (!data.parentMobileNumber || !validatePhone(data.parentMobileNumber)) {
      errors.push('Valid parent mobile number required');
    }
  }

  // Faculty/Staff-specific validations
  if (type === 'faculty' || type === 'staff') {
    if (!data.staffName) {
      errors.push('Name required');
    }

    if (!data.employeeId) {
      errors.push('Employee ID required');
    }

    if (!data.designation) {
      errors.push('Designation required');
    }

    if (!data.department) {
      errors.push('Department required');
    }

    if (!data.dateOfJoining) {
      errors.push('Date of joining required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePhone,
  validateRollNo,
  validateApplicationForm
};
