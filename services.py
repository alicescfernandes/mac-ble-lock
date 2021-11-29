import asyncio
import platform

from bleak import BleakClient


async def print_services(mac_addr: str, loop: asyncio.AbstractEventLoop):
    async with BleakClient(mac_addr, loop=loop) as client:
        svcs = await client.get_services()
        for s in svcs:
            print(s.uuid)
        #print("Services:", svcs.get_service(160))

loop = asyncio.get_event_loop()
loop.run_until_complete(print_services("D7CD04BA-C7DF-4669-B682-693024779AB6", loop))