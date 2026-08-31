import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private readonly resend: Resend;
    private readonly fromAddress: string;
    private readonly logger = new Logger(EmailService.name);

    constructor(private readonly config: ConfigService) {
        this.resend = new Resend(config.getOrThrow<string>('RESEND_API_KEY'));
        this.fromAddress = config.getOrThrow<string>('EMAIL_FROM_ADDRESS');
    }

    async send(to: string, subject: string, htmlBody: string): Promise<void> {
        const { error } = await this.resend.emails.send({
            from: `PawCare <${this.fromAddress}>`,
            to,
            subject,
            html: htmlBody,
        });

        if (error) {
            this.logger.error(`Resend error: ${error.message}`);
            throw new Error(error.message);
        }
    }
}