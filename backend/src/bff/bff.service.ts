import { Injectable } from '@nestjs/common';
import { LabourService } from '../labour/labour.service';

@Injectable()
export class BffService {
  constructor(private readonly labourService: LabourService) {}

  // 1. Dashboard Overview Aggregator (Powers the KPI Cards in 1 API call!)
  async getDashboardSummary(dateString?: string) {
    const today = dateString || new Date().toISOString().split('T')[0];
    const sheet = await this.labourService.getDailyAttendanceSheet(today);
    const allLabours = await this.labourService.getAllLabours();

    const totalLabours = allLabours.length;
    let presentCount = 0;
    let halfDayCount = 0;
    let absentCount = 0;
    let totalDailyWages = 0;

    sheet.forEach((item) => {
      if (item.status === 'PRESENT') presentCount++;
      if (item.status === 'HALF_DAY') halfDayCount++;
      if (item.status === 'ABSENT') absentCount++;
      totalDailyWages += item.calculatedWage;
    });

    const unmarkedCount = totalLabours - (presentCount + halfDayCount + absentCount);

    return {
      date: today,
      totalLabours,
      presentCount,
      halfDayCount,
      absentCount,
      unmarkedCount,
      totalDailyWages,
      currency: '₹',
    };
  }

  // 2. Chatbot Bridge to your friend's Python API (with intelligent fallback)
  async forwardToPythonChatbot(userMessage: string) {
    const pythonUrl = process.env.PYTHON_CHATBOT_URL || 'http://localhost:8000/chat';

    try {
      // Attempt to call your friend's Python AI server
      const response = await fetch(pythonUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          reply: data.reply || data.response || 'Response received from Python AI',
          source: 'Python Microservice',
        };
      }
    } catch (error) {
      console.warn('Python chatbot is offline. Using local AI fallback response.');
    }

    // Smart Fallback: Ensures your presentation NEVER breaks even if his Python server is off!
    return {
      reply: this.generateFallbackResponse(userMessage),
      source: 'Labour Assistant (Local Fallback)',
    };
  }

  private generateFallbackResponse(msg: string): string {
    const q = msg.toLowerCase();
    if (q.includes('wage') || q.includes('salary') || q.includes('rate')) {
      return 'Daily wages are calculated based on attendance: Present receives 100% of daily wage, Half-Day receives 50%, and Absent receives ₹0.';
    }
    if (q.includes('onboard') || q.includes('add') || q.includes('labour')) {
      return 'You can onboard a new worker from Screen 1 using the "+ Onboard Labour" button by providing their Name, Skill, Phone, and Daily Wage rate.';
    }
    if (q.includes('attendance')) {
      return 'Navigate to Screen 2 to mark daily attendance. You can set status as Present, Half-Day, or Absent for Day or Night shift.';
    }
    return `Hello! I am your Labour & Payroll AI Assistant. How can I help you with workers, wages, or attendance today?`;
  }
}