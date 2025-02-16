<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        User::factory(10)->create();

        for ($i = 0; $i < 5; $i++) {
            $group = Group::factory()->create([
                'owner_id' => 1,
            ]);

            $users = User::inRandomOrder()->limit(rand(2, 5))->pluck('id');
            $group->users()->attach(array_unique([1, ...$users]));
        }

        Message::factory(1000)->create();
        $messages = Message::whereNull('group_id')->orderBy('created_at')->get();

        $conversation = $messages->groupBy(function ($message) {
            return collect([$message->sender_id, $message->receiver_id])
                ->sort()->implode('_');
        })->map(function ($groupedMessages) {
            return [
                'user_id1' => $groupedMessages->first()->sender_id,
                'user_id2' => $groupedMessages->first()->receiver_id,
                'last_message_id' => $groupedMessages->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon()
            ];
        })->values();

        Conversation::insertOrIgnore($conversation->toArray());

        $allMessageConversation = Message::whereNull('group_id')->get();
        $allMessageConversation->each(function ($message) {
            $conversation = Conversation::where('user_id1', $message->sender_id)
                ->where('user_id2', $message->receiver_id)
                ->orWhere(function ($query) use ($message) {
                    $query->where('user_id1', $message->receiver_id)
                        ->where('user_id2', $message->sender_id);
                })->first();

            $message->update(['conversation_id' => $conversation->id]);
        });

        $allMessageGroup = Message::whereNotNull('group_id')->orderBy('created_at')->get();
        $allMessageGroup->groupBy('group_id')->map(function ($groupedMessages) {
            $group = Group::find($groupedMessages->first()->group_id);
            $group->update([
                'last_message_id' => $groupedMessages->last()->id,
            ]);
        });
    }
}
