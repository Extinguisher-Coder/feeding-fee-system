const axios = require('axios');
const Student = require('../models/studentModel');

const sendReminders = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'No students provided for reminder' });
    }

    const studentIds = students.map((s) => s.studentId);
    const studentRecords = await Student.find({ studentId: { $in: studentIds } });

    let successCount = 0;
    let failedList = [];

    for (const { studentId, weeksOwed, amountOwed } of students) {
      const student = studentRecords.find((s) => s.studentId === studentId);

      if (!student) {
        failedList.push({ studentId, reason: 'Student not found in DB' });
        continue;
      }

      const { firstName, lastName, classLevel, guardianContact } = student;

      if (!guardianContact) {
        failedList.push({ studentId, reason: 'No guardian contact' });
        continue;
      }

      const messageText = `Dear Parent, \nOur records show that ${firstName} ${lastName} owes Feeding fee for ${weeksOwed} week(s) (GHS ${amountOwed}). Kindly make payment else your ward will not be fed. For any concerns, Call: 0242382484. Thank you.`;

      const smsPayload = {
        text: messageText,
        type: 0,
        sender: process.env.SMS_SENDER,
        destinations: [guardianContact], 
      };

      try {
        const smsResponse = await axios.post(
          'https://api.smsonlinegh.com/v5/message/sms/send',
          smsPayload,
          {
            headers: {
              'Authorization': `key ${process.env.SMS_API_KEY}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );

        if (smsResponse.status === 200) {
          successCount++;
        } else {
          failedList.push({ studentId, reason: `SMS failed with status ${smsResponse.status}` });
        }
      } catch (error) {
        failedList.push({ studentId, reason: error.message });
      }
    }

    res.status(200).json({
      message: `Reminders sent: ${successCount} successful, ${failedList.length} failed`,
      successCount,
      failedList,
    });

  } catch (error) {
    console.error('Error sending reminders:', error);
    res.status(500).json({ error: 'Failed to send reminders', details: error.message });
  }
};

module.exports = {
  sendReminders,
};
