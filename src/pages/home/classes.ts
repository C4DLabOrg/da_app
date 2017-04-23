
export class Classes{
    id:number
    class_name:string
    students:Student[]
    

    
}

export class Student{
    emis_code:number
    id:number
    fstname:string
    lstname:string
    midname:string
    class_id:number
    gender:string
    student_name:string
    student_id:number
    status:boolean=false
    date_enrolled:string    
    guardian_name:string
    guardian_phone:string

}
export class Teacher{
    id:number
    user:number
    fstname:string
    name:string
    lstname:string
    phone_no:string
    teacher_type:string
    birthday:string
    gender:string
    tsc_no:string
    bom_no:string
    headteacher:boolean
    qualifications:string
    subjects:any
    school:number
    date_started_teaching:string
    joined_current_school:string
    school_name:string
}