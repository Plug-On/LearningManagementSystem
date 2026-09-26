<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function initiate(Request $request)
    {
        $request->validate([
            'course_id' => 'required|integer',
        ]);

        $user = $request->user();

        $course = Course::find($request->course_id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        // Check whether user is already enrolled
        $alreadyEnrolled = Enrollment::where([
            'user_id' => $user->id,
            'course_id' => $course->id
        ])->exists();

        if ($alreadyEnrolled) {
            return response()->json([
                'status' => 400,
                'message' => 'You are already enrolled in this course.'
            ], 400);
        }

        /*
        |--------------------------------------------------------------------------
        | eSewa Configuration
        |--------------------------------------------------------------------------
        */

        $productCode = env('ESEWA_PRODUCT_CODE', 'EPAYTEST');
        $secretKey = env('ESEWA_SECRET_KEY');

        /*
        |--------------------------------------------------------------------------
        | Amount
        |--------------------------------------------------------------------------
        |
        | Keep exactly the same value for:
        | 1. Database
        | 2. Signature
        | 3. eSewa form
        |
        */

        $amount = number_format((float) $course->price, 2, '.', '');

        /*
        |--------------------------------------------------------------------------
        | Transaction UUID
        |--------------------------------------------------------------------------
        */

        $transactionUuid = 'LMS-' . $user->id . '-' . $course->id . '-' . time();

        /*
        |--------------------------------------------------------------------------
        | Create Pending Payment
        |--------------------------------------------------------------------------
        */

        $payment = Payment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'amount' => $amount,
            'transaction_uuid' => $transactionUuid,
            'product_code' => $productCode,
            'status' => 'pending',
        ]);

        /*
        |--------------------------------------------------------------------------
        | eSewa Signature
        |--------------------------------------------------------------------------
        |
        | This must match the exact format used by your old PetZone project:
        |
        | total_amount=amount,
        | transaction_uuid=uuid,
        | product_code=EPAYTEST
        |
        */

        $message =
            'total_amount=' . $amount .
            ',transaction_uuid=' . $transactionUuid .
            ',product_code=' . $productCode;

        $signature = base64_encode(
            hash_hmac(
                'sha256',
                $message,
                $secretKey,
                true
            )
        );

        /*
        |--------------------------------------------------------------------------
        | Return eSewa Payment Data
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'status' => 200,
            'message' => 'Payment initiated',

            'data' => [
                'amount' => $amount,
                'tax_amount' => '0',
                'total_amount' => $amount,

                'transaction_uuid' => $transactionUuid,
                'product_code' => $productCode,

                'product_service_charge' => '0',
                'product_delivery_charge' => '0',

                'success_url' => url('/api/esewa/success'),
                'failure_url' => url('/api/esewa/failure'),

                'signed_field_names' =>
                    'total_amount,transaction_uuid,product_code',

                'signature' => $signature,
            ]
        ]);
    }

public function success(Request $request)
{
    try {

        // eSewa sends the payment information inside the "data" parameter
        $encodedData = $request->query('data');

        if (!$encodedData) {
            return redirect(
                env('FRONTEND_URL') . '/payment-failure'
            );
        }

        // Decode Base64 data
        $decodedData = base64_decode($encodedData, true);

        if ($decodedData === false) {
            return redirect(
                env('FRONTEND_URL') . '/payment-failure'
            );
        }

        // Convert JSON data into PHP array
        $data = json_decode($decodedData, true);

        if (!is_array($data)) {
            return redirect(
                env('FRONTEND_URL') . '/payment-failure'
            );
        }

        // Find payment using transaction UUID
        $payment = Payment::where(
            'transaction_uuid',
            $data['transaction_uuid'] ?? ''
        )->first();

        if (!$payment) {
            return redirect(
                env('FRONTEND_URL') . '/payment-failure'
            );
        }

        // Check eSewa payment status
        if (($data['status'] ?? '') !== 'COMPLETE') {
            return redirect(
                env('FRONTEND_URL') . '/payment-failure'
            );
        }

        // Mark payment as paid
        $payment->transaction_code = $data['transaction_code'] ?? null;
        $payment->status = 'paid';
        $payment->save();

        // Check if user is already enrolled
        $alreadyEnrolled = Enrollment::where([
            'user_id' => $payment->user_id,
            'course_id' => $payment->course_id
        ])->exists();

        // Create enrollment
        if (!$alreadyEnrolled) {

            $enrollment = new Enrollment();
            $enrollment->user_id = $payment->user_id;
            $enrollment->course_id = $payment->course_id;
            $enrollment->save();
        }

        // Send user back to React
        return redirect(
            env('FRONTEND_URL') .
            '/account/my-learning'
        );

    } catch (\Exception $e) {

        Log::error(
    'eSewa payment callback error: ' .
    $e->getMessage()
);

        return redirect(
            env('FRONTEND_URL') . '/payment-failure'
        );
    }
}




        public function failure(Request $request)
    {
        return redirect(
            env('FRONTEND_URL') .
            '/payment-failure'
        );
    }
}
