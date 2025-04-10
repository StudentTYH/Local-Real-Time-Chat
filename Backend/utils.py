
import aiohttp

async def set_audio_output(setting):
    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }

    async with aiohttp.ClientSession() as session:  # 使用 async with 进行异步会话
        try:
            async with session.post(
                    url="http://localhost:8020/set_tts_settings",
                    headers=headers,
                    json=setting
            ) as resp:
                if resp.status == 200:
                    print("Setting successfully applied.")
                else:
                    print(f"Failed to apply settings. Status code: {resp.status}")
        except Exception as e:
            print(f"Error during request: {e}")