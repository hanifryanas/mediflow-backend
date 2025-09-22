import { Expose } from 'class-transformer';
import { differenceInDays } from 'date-fns';
import { User } from 'modules/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeeDepartment } from '../enums/employee-department.enum';

@Entity('Employee')
export class Employee {
  @PrimaryGeneratedColumn('identity')
  employeeId: number;

  @OneToOne(() => User, (user) => user.userId, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Expose()
  get fullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  retirementDate?: Date;

  @Expose()
  get employmentDuration(): string {

    const laterDate = this.retirementDate ? new Date(this.retirementDate) : new Date();
    const days = differenceInDays(laterDate, this.startDate);

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;

    let result = '';
    if (years > 0) {
      result += `${years} year(s) `;
    }

    if (months > 0) {
      result += `${months} month(s) `;
    }

    if (remainingDays > 0) {
      result += `${remainingDays} day(s)`;
    }

    return result.trim();
  }

  @Column({ type: 'enum', enum: EmployeeDepartment })
  department: EmployeeDepartment;
}