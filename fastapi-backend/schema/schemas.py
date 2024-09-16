def individual_serializer(events) -> dict:
    return {
        "id": str(events["_id"]),
        "name": events["name"],
        "details_of_event": events["details_of_event"],
        "date": events["date"],
        "time": events["time"],
        "address": events["address"]
    }


def list_serializer(events) -> list:
    return [individual_serializer(event) for event in events]