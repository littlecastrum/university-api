const { Schema, model } = require('mongoose');

const StudentSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  address: String,
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  carrer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Carrer'
  }
});

const subjectSchema = new Schema({
  name: String,
  timeslots: Number,
  carrer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Carrer'
  }
});

const studentSubjectSchema = new Schema({
  student_id: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  subject_id: {
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  },
  state: {
    type: String,
    enum : ['IN_COURSE', 'APPROVED', 'FAILED'],
    default: 'IN_COURSE'
  },
  score: Number
});

const carrerSchema = new Schema({
  name: String,
  title: String,
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }]
});

module.exports = {
  Student: model('Student', StudentSchema),
  Subject: model('Subject', subjectSchema),
  StudentSubject: model('StudentSubject', studentSubjectSchema),
  Carrer: model('Carrer', carrerSchema)
}