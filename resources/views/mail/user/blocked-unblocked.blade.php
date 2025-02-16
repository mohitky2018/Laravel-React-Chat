<x-mail::message>
    Hello {{ $user->name }}

    @if ($user->blocked_at)
    Your account has been blocked. You can't use the system anymore.
    @else
    Your account has been activated. You can now normally use the system
    <x:mail::button url="{{ route('login') }}">
        Click here to login
    </x:mail::button>
    @endif

    Thank you, <br />
    {{ config('app.name')}}
</x-mail::message>