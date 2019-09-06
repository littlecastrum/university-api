const { Schema, model } = require('mongoose');

const StudentSchema = new Schema({
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
  career_id: {
    type: Schema.Types.ObjectId,
    ref: 'Career'
  }
});

const subjectSchema = new Schema({
  name: String,
  timeslots: Number,
  career_id: {
    type: Schema.Types.ObjectId,
    ref: 'Career'
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

const careerSchema = new Schema({
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
  Career: model('Career', careerSchema)
}