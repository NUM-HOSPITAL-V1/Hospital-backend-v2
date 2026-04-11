export const toPublicUser = (doc) => {
  return {
    id: doc._id,
    firstname: doc.firstname,
    lastname: doc.lastname,
    email: doc.email,
    phoneNumber: doc.phoneNumber,
    role:doc.role, //tur
  };
};
export const toPublicPatient = (doc) => {
  return {
    id: doc._id,
    _id: doc._id,
    firstname: doc.firstname,
    lastname: doc.lastname,
    email: doc.email,
    phoneNumber: doc.phoneNumber,
    role:doc.role, //tur
    birthOfDate:doc.birthOfDate,
    type:doc.type,
    register:doc.register,
    address:doc.address,
    school:doc.school,
    sisiID:doc.sisiID,
    occupation:doc.occupation,
    education:doc.education,
    gender:doc.gender,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};
export const toPublicMedStaff = (doc) => {
  return {
    id: doc._id,
    firstname: doc.firstname,
    lastname: doc.lastname,
    email: doc.email,
    phoneNumber: doc.phoneNumber,
    role:doc.role, //tur
    position: doc.position,
    specialization: doc.specialization,
  };
};

export const modifiedPatient = (doc) => {
  return {
    id: doc._id,
    firstname: doc.firstname,
    lastname: doc.lastname,
    email: doc.email,
    phoneNumber: doc.phoneNumber,
  };
};
