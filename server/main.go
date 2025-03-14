package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader {
	CheckOrigin: func(r * http.Request) bool { return true }, 
}

func webSocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil) 
	if err != nil {
		log.Println("WebSocket upgrade failed: ", err) 
		http.Error(w, "WebSocket upgrade failed", http.StatusBadRequest)
		return 
	}
	defer conn.Close() 
	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read erro: ", err) 
			break 
		}
		log.Printf("Recevied: %s", message)
		if err := conn.WriteMessage(messageType, message); err != nil{
			log.Println("Write error: ", err)
			break
		}
	}
}

func sendMessages (w http.ResponseWriter, r *http.Request) {
	
}

func router (w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/ws": 
		webSocketHandler(w, r)
	case "/send": 
		sendMessages(w, r) 
	default: 
		http.NotFound(w, r) 
	}
}

func main() {
	http.HandleFunc("/", webSocketHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	} 
	fmt.Printf("Server running on http://localhost%s\n", port) 
	log.Fatal(http.ListenAndServe(port, nil))
}


