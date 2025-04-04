import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';


@Injectable()
export class TasksService {
    @Cron('* * * * *')
    async randomCron(): Promise<void> {
        const usage = process.memoryUsage();
        const usedMB = (usage.heapUsed / 1024 / 1024).toFixed(2);
        const totalMB = (usage.heapTotal / 1024 / 1024).toFixed(2);
        const memoryUsage = ((usage.heapUsed / usage.heapTotal) * 100).toFixed(2);
        // eslint-disable-next-line
        console.log(
            `Current Time: ${new Date().toLocaleString()}, memory used: ${usedMB} MB, total: ${totalMB} MB, ${memoryUsage}%, random number: ${Math.random()}`,
        );
    }
}
