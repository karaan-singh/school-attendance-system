import ExcelJS from 'exceljs';
import { Buffer } from 'node:buffer';

export interface StudentImportRow {
  rollNumber: string;
  fullName: string;
  gender: string;
  avatarIcon: string;
  parentPhone: string;
  treeSpecies: string;
  classCode?: string;
  isValid: boolean;
  errors: string[];
}

export interface AttendanceExportData {
  schoolName: string;
  className: string;
  classCode: string;
  date: string;
  teacherName: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number;
  records: Array<{
    rollNumber: string;
    fullName: string;
    gender: string;
    treeSpecies: string;
    status: string;
    checkInTime?: string;
    note?: string;
  }>;
}

// Generate styled Excel (.xlsx) buffer for attendance session
export async function generateAttendanceExcel(data: AttendanceExportData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Forest Quest Attendance System';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Attendance Report', {
    views: [{ showGridLines: true }],
  });

  // 1. Title Banner
  worksheet.mergeCells('A1:G2');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `🌲 ${data.schoolName.toUpperCase()} — ATTENDANCE RECORD`;
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF14532D' }, // Deep forest emerald
  };

  // 2. Metadata Section
  worksheet.getCell('A4').value = 'Class:';
  worksheet.getCell('B4').value = `${data.className} (${data.classCode})`;
  worksheet.getCell('D4').value = 'Session Date:';
  worksheet.getCell('E4').value = data.date;

  worksheet.getCell('A5').value = 'Teacher / Ranger:';
  worksheet.getCell('B5').value = data.teacherName;
  worksheet.getCell('D5').value = 'Generated:';
  worksheet.getCell('E5').value = new Date().toLocaleDateString();

  ['A4', 'D4', 'A5', 'D5'].forEach((pos) => {
    worksheet.getCell(pos).font = { bold: true, color: { argb: 'FF166534' } };
  });

  // 3. Stats Summary Boxes
  const stats = [
    { label: 'Total Enrolled', val: data.totalStudents, col: 'A', fg: 'FFF3F4F6' },
    { label: 'Present', val: data.presentCount, col: 'B', fg: 'FFDCFCE7' },
    { label: 'Absent', val: data.absentCount, col: 'C', fg: 'FFFEE2E2' },
    { label: 'Late', val: data.lateCount, col: 'D', fg: 'FFFEF3C7' },
    { label: 'Excused', val: data.excusedCount, col: 'E', fg: 'FFE0F2FE' },
    { label: 'Attendance Rate', val: `${data.attendanceRate.toFixed(1)}%`, col: 'F', fg: 'FFD1FAE5' },
  ];

  stats.forEach(({ label, val, col, fg }) => {
    const headerCell = worksheet.getCell(`${col}7`);
    headerCell.value = label;
    headerCell.font = { size: 9, bold: true, color: { argb: 'FF4B5563' } };
    headerCell.alignment = { horizontal: 'center' };

    const valCell = worksheet.getCell(`${col}8`);
    valCell.value = val;
    valCell.font = { size: 14, bold: true, color: { argb: 'FF111827' } };
    valCell.alignment = { horizontal: 'center' };
    valCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: fg },
    };
    valCell.border = {
      top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    };
  });

  // 4. Student Roster Table Header
  const headers = ['Roll No', 'Student Name', 'Gender', 'Tree Species', 'Status', 'Check-In Time', 'Notes'];
  const headerRow = worksheet.getRow(10);
  headerRow.values = headers;
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.height = 26;
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  for (let c = 1; c <= headers.length; c++) {
    const cell = headerRow.getCell(c);
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF166534' }, // Emerald header
    };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FF0F3B20' } },
    };
  }

  // 5. Populate Data Rows
  let currentRow = 11;
  data.records.forEach((record) => {
    const row = worksheet.getRow(currentRow);
    row.values = [
      record.rollNumber,
      record.fullName,
      record.gender,
      record.treeSpecies,
      record.status,
      record.checkInTime || '—',
      record.note || '',
    ];

    row.alignment = { vertical: 'middle' };
    row.getCell(1).alignment = { horizontal: 'center' };
    row.getCell(3).alignment = { horizontal: 'center' };
    row.getCell(5).alignment = { horizontal: 'center' };
    row.getCell(6).alignment = { horizontal: 'center' };

    // Status Cell Styling
    const statusCell = row.getCell(5);
    statusCell.font = { bold: true };
    if (record.status === 'PRESENT') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
      statusCell.font = { bold: true, color: { argb: 'FF15803D' } };
    } else if (record.status === 'ABSENT') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
      statusCell.font = { bold: true, color: { argb: 'FFB91C1C' } };
    } else if (record.status === 'LATE') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
      statusCell.font = { bold: true, color: { argb: 'FFB45309' } };
    } else if (record.status === 'EXCUSED') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } };
      statusCell.font = { bold: true, color: { argb: 'FF0369A1' } };
    }

    // Light zebra striping
    if (currentRow % 2 === 0 && record.status !== 'PRESENT' && record.status !== 'ABSENT') {
      for (let c = 1; c <= headers.length; c++) {
        if (c !== 5) {
          row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
        }
      }
    }

    currentRow++;
  });

  // Column Widths
  worksheet.columns = [
    { width: 14 }, // Roll
    { width: 25 }, // Name
    { width: 12 }, // Gender
    { width: 20 }, // Tree Species
    { width: 16 }, // Status
    { width: 18 }, // Check-In
    { width: 28 }, // Notes
  ];

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

// Generate Blank Roster Template for Teachers
export async function generateRosterTemplate(): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('Student Import Template');

  ws.columns = [
    { header: 'Roll No', key: 'rollNumber', width: 15 },
    { header: 'Student Name', key: 'fullName', width: 26 },
    { header: 'Class Code', key: 'classCode', width: 14 },
    { header: 'Gender', key: 'gender', width: 14 },
    { header: 'Avatar Icon', key: 'avatarIcon', width: 18 },
    { header: 'Parent Phone', key: 'parentPhone', width: 18 },
    { header: 'Tree Species', key: 'treeSpecies', width: 22 },
  ];

  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF166534' } };

  // Sample Rows
  ws.addRow({
    rollNumber: 'STU-401',
    fullName: 'Robin Swift',
    classCode: '1-A',
    gender: 'Boy',
    avatarIcon: 'falcon-swift',
    parentPhone: '+1 555-4011',
    treeSpecies: 'Emerald Oak',
  });
  ws.addRow({
    rollNumber: 'STU-402',
    fullName: 'Ivy Meadow',
    classCode: '1-A',
    gender: 'Girl',
    avatarIcon: 'star-fairy',
    parentPhone: '+1 555-4022',
    treeSpecies: 'Silver Birch',
  });

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

// Parse uploaded Excel buffer into validated student rows
export async function parseStudentExcel(buffer: any): Promise<StudentImportRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const rows: StudentImportRow[] = [];
  let headerMap: Record<string, number> = {};

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      // Build column mapping
      row.eachCell((cell, colNumber) => {
        const val = String(cell.value || '').toLowerCase().trim();
        if (val.includes('roll')) headerMap['roll'] = colNumber;
        else if (val.includes('name')) headerMap['name'] = colNumber;
        else if (val.includes('class')) headerMap['class'] = colNumber;
        else if (val.includes('gender')) headerMap['gender'] = colNumber;
        else if (val.includes('avatar') || val.includes('icon')) headerMap['avatar'] = colNumber;
        else if (val.includes('phone')) headerMap['phone'] = colNumber;
        else if (val.includes('tree') || val.includes('species')) headerMap['tree'] = colNumber;
      });
      return;
    }

    const rollVal = String(row.getCell(headerMap['roll'] || 1).value || '').trim();
    const nameVal = String(row.getCell(headerMap['name'] || 2).value || '').trim();
    const classVal = String(row.getCell(headerMap['class'] || 3).value || '').trim();
    const genderVal = String(row.getCell(headerMap['gender'] || 4).value || 'Other').trim();
    const avatarVal = String(row.getCell(headerMap['avatar'] || 5).value || 'sprout-leaf').trim();
    const phoneVal = String(row.getCell(headerMap['phone'] || 6).value || '').trim();
    const treeVal = String(row.getCell(headerMap['tree'] || 7).value || 'Emerald Oak').trim();

    if (!rollVal && !nameVal) return; // skip blank rows

    const errors: string[] = [];
    if (!rollVal) errors.push('Missing Roll Number');
    if (!nameVal) errors.push('Missing Student Name');

    rows.push({
      rollNumber: rollVal,
      fullName: nameVal,
      classCode: classVal || undefined,
      gender: genderVal,
      avatarIcon: avatarVal || 'sprout-leaf',
      parentPhone: phoneVal,
      treeSpecies: treeVal || 'Emerald Oak',
      isValid: errors.length === 0,
      errors,
    });
  });

  return rows;
}
