export class StudentManager {
    constructor() {
        this.students = [];
    }
    addStudent(student) {
        this.students.push(student);
        this.saveToLocalStorage();
    }
    getAllStudents() {
        return this.students;
    }
    findStudentByID(id) {
        return this.students.find(s => s.id === id);
    }
    findStudentsByName(keyword) {
        return this.students.filter(s => s.first_name.toLowerCase().includes(keyword.toLowerCase()) ||
            s.last_name.toLowerCase().includes(keyword.toLowerCase()));
    }
    findStudentsByMajor(major) {
        return this.students.filter(s => s.major.toLowerCase().includes(major.toLowerCase()));
    }
    findStudentByEmail(email) {
        return this.students.find(s => s.email === email);
    }
    saveToLocalStorage() {
        localStorage.setItem("students", JSON.stringify(this.students));
    }
    loadFromLocalStorage() {
        const data = localStorage.getItem("students");
        if (data) {
            this.students = JSON.parse(data);
        }
    }
}
