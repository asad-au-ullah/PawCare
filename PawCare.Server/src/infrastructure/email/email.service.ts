import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly transporter: nodemailer.Transporter;
    private readonly fromAddress: string;
    private readonly logger = new Logger(EmailService.name);

    constructor(private readonly config: ConfigService) {
        const user = config.getOrThrow<string>('EMAIL_USER');
        const pass = config.getOrThrow<string>('EMAIL_APP_PASSWORD');

        this.fromAddress = config.get<string>('EMAIL_FROM_ADDRESS') ?? user;

        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // STARTTLS
            auth: { user, pass },
        });
    }

    async send(to: string, subject: string, htmlBody: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: `PawCare <${this.fromAddress}>`,
                to,
                subject,
                html: htmlBody,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            this.logger.error(`Nodemailer error: ${message}`);
            throw new Error(message);
        }
    }
}