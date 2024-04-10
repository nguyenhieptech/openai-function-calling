'use client';

import { AI } from '@/app/action';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Purchase } from '@/lib/schemas/purchase.schema';
import { Room } from '@/lib/schemas/room.schema';
import { sleep } from '@/lib/utils';
import { useAIState } from 'ai/rsc';
import { useId, useState } from 'react';
import { SystemMessage } from './messages';

enum PaymentStatus {
  Idle,
  Pending,
  Success,
  Failed,
}

enum Views {
  EnterOtp,
  Success,
  Failed,
}

export function Checkout({ room }: { room: Room }) {
  const [history, setHistory] = useAIState<typeof AI>();
  const [view, setView] = useState(Views.EnterOtp);
  const [systemMessages, setSystemMessages] = useState<string[]>([]);
  const [status, setStatus] = useState(PaymentStatus.Idle);
  const [otp, setOtp] = useState('');
  const id = useId();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus(PaymentStatus.Pending);

    if (otp.length !== 6) {
      setStatus(PaymentStatus.Idle);
      return;
    }

    try {
      await sleep(500);

      if (Math.random() > 0.8) {
        throw new Error('Payment failed');
      }

      const invoiceId = String(Math.floor(Math.random() * 1000));
      const purchase: Purchase = {
        invoiceUrl: `https://example.com/invoice/${invoiceId}`,
        room: room,
        id: invoiceId,
      };

      const info = {
        role: 'system' as const,
        content: `User has successfully purchased ${room.name} with id ${room.id}. Full purchase ${JSON.stringify(
          purchase
        )}`,
        id,
      };

      setHistory([...history, info]);
      setStatus(PaymentStatus.Success);
      setView(Views.Success);
      setSystemMessages((prev) => [
        ...prev,
        `You have successfully purchased ${room.name} for a total of ${new Intl.NumberFormat(
          'en-US',
          { style: 'currency', currency: 'USD' }
        ).format(room.price)}`,
      ]);
    } catch (error) {
      const info = {
        role: 'system' as const,
        content: `User has failed to purchase ${room.name} with id ${room.id}`,
        id,
      };

      if (history[history.length - 1]?.id === id) {
        setHistory([...history.slice(0, -1), info]);
        return;
      } else {
        setHistory([...history, info]);
      }

      setSystemMessages((prev) => [
        ...prev,
        `Payment for ${room.name} failed. Please try again.`,
      ]);
      setStatus(PaymentStatus.Failed);
      setView(Views.Failed);
    }
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <hr className="my-4" />
        <div className="flex flex-row justify-between gap-4 align-middle">
          <h2 className="block text-xl font-bold">{room.name}</h2>
          <span>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(room.price)}
          </span>
        </div>

        {view === Views.EnterOtp && (
          <div className="my-6 flex flex-col justify-center gap-4 rounded-md border-2 border-slate-300/20 bg-slate-100/5 p-4 align-middle sm:flex-row">
            <div>
              <strong className="text-center">
                Complete your payment by entering the OTP sent to your phone
              </strong>

              <p>
                An OTP has been sent to your phone number ending in{' '}
                <strong>**** 1234</strong>
              </p>
            </div>
            <form
              onSubmit={submit}
              className="my-4 flex flex-col justify-center gap-4 align-middle"
            >
              <div className="flex flex-row justify-center align-middle">
                <InputOTP
                  maxLength={6}
                  containerClassName="group flex items-center has-[:disabled]:opacity-30 align-middle w-content"
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                variant={'default'}
                disabled={
                  [PaymentStatus.Pending, PaymentStatus.Success].includes(status) ||
                  otp.length !== 6
                }
              >
                {status === PaymentStatus.Pending
                  ? 'Processing...'
                  : status === PaymentStatus.Success
                    ? 'Payment successful'
                    : status === PaymentStatus.Failed
                      ? 'Payment failed. Go ahead and retry'
                      : 'Complete payment'}
              </Button>
            </form>
          </div>
        )}

        {view === Views.Success && (
          <div className="my-6 rounded-md border-2 border-emerald-300/20 bg-emerald-100/5 p-4">
            <h2 className="text-xl font-bold">Payment successful</h2>

            <p className="mt-2">
              Your payment has been successfully processed. You will receive a
              confirmation email shortly.
            </p>
          </div>
        )}

        {view === Views.Failed && (
          <div className="my-4 flex justify-between gap-4 align-middle">
            <span className="block text-red-500">Payment failed</span>
            <Button
              variant={'default'}
              onClick={() => {
                setView(Views.EnterOtp);
                setStatus(PaymentStatus.Idle);
              }}
            >
              Retry payment
            </Button>
          </div>
        )}
      </div>
      {systemMessages.map((message, id) => (
        <SystemMessage key={id}>{message}</SystemMessage>
      ))}
    </>
  );
}
